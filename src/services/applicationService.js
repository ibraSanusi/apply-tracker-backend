import { getApplications, insertApplication, findApplicationById, deleteApplication, updateApplication } from "../repositories/applicationRepository.js"
import 'dotenv/config.js'
import OpenAI from 'openai';
import {
    PutObjectCommand,
    S3Client,
    DeleteObjectCommand,
    GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { applicationChatInstruction, applicationChatResponseFormat } from "../utils/constants.js";
import { Readable } from 'node:stream'
import { generateDocxFromJson, convertDocxToPdf } from "../utils/docxGenerator.js";

const s3Client = new S3Client({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_kEY,
        secretAccessKey: process.env.AWS_SECRET_S3_kEY,
    },
});

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export async function saveApplicationService(body, db) {
    const { cv, cover, ...restBody } = body
    const { coverSlug, cvSlug, cvPdfSlug } = await uploadApplicationMediaS3({ cv, cover })
    const application = await insertApplication({ coverSlug, cvSlug, cvPdfSlug, ...restBody }, db)

    const coverUrl = await getApplicationObjectSignedUrl(coverSlug)
    const cvUrl = await getApplicationObjectSignedUrl(cvSlug)
    const cvPdfUrl = await getApplicationObjectSignedUrl(cvPdfSlug)

    return { ...application, cvUrl, coverUrl, cvPdfUrl }
}


async function uploadFilesS3(files) {
    if (process.env.NODE_ENV === 'test') {
        return files.map((file, idx) => ({ key: file.key, location: `${file.key}${idx + 1}` }))
    }

    return await Promise.all(files.map(async file => {
        const { key, body, contentType } = file

        return await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: body,
                ContentType: contentType || 'text/plain',
                ContentDisposition: 'inline',
            }),
        )
    }))
}

export async function uploadApplicationMediaS3({ cv, cover }) {
    const cvSlug = `applications/cv/${crypto.randomUUID()}.docx`
    const cvPdfSlug = `applications/cv/${crypto.randomUUID()}.pdf`
    const coverSlug = `applications/cover/${crypto.randomUUID()}.txt`

    // cv is expected to be an object (from Chat/AI)
    const cvBuffer = await generateDocxFromJson(JSON.parse(cv));
    const cvPdfBuffer = await convertDocxToPdf(cvBuffer);

    const [cvUpload, cvPdfUpload, coverUpload] = await uploadFilesS3([
        {
            key: cvSlug,
            body: cvBuffer,
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        },
        { key: cvPdfSlug, body: cvPdfBuffer, contentType: 'application/pdf' },
        {
            key: coverSlug,
            body: Buffer.from(cover),
            contentType: 'text/plain'
        }
    ])

    if (!cvUpload || !cvPdfUpload || !coverUpload) { throw new Error('Error uploading cover, cv and pdf to AWS') }

    return { cvSlug, cvPdfSlug, coverSlug }
}


export async function getApplicationObjectSignedUrl(key) {
    if (process.env.NODE_ENV === 'test') return key

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        ResponseContentDisposition: 'inline',
    })

    return await getSignedUrl(s3Client, command, {
        expiresIn: 300, // 5 min
    })
}

export async function askChatService({ jobDescription, cvTemplate }) {
    const openaiStream = await openaiClient.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: applicationChatInstruction },
            { role: 'user', content: `Oferta de trabajo:\n${jobDescription}\n\nCV base del candidato (adapta este CV a la oferta):\n${cvTemplate}\n\nDevuelve el resultado en este formato JSON:\n${applicationChatResponseFormat}` },
        ],
        stream: true,
    })

    const readable = new Readable({ read() { } })

        ; (async () => {
            for await (const chunk of openaiStream) {
                const content = chunk.choices[0]?.delta?.content || ''
                if (content) {
                    readable.push(content)
                }
            }
            readable.push(null)
        })()

    return readable
}

export async function getApplicationsService(userId, db) {
    return await getApplications(userId, db)
}

export async function getApplicationByIdService(id, db) {
    const application = await findApplicationById(id, db)
    if (!application) return null

    const cvUrl = await getApplicationObjectSignedUrl(application.cvSlug)
    const coverUrl = await getApplicationObjectSignedUrl(application.coverSlug)
    const cvPdfUrl = await getApplicationObjectSignedUrl(application.cvPdfSlug)

    return { ...application, cvUrl, coverUrl, cvPdfUrl }
}

export async function deleteFileFromS3(key) {
    if (process.env.NODE_ENV === 'test') return

    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        }))
    } catch (error) {
        console.error(`Error deleting file from S3 (${key}):`, error)
        // No lanzamos error para no bloquear la operación principal, pero logueamos
    }
}

export async function updateApplicationService(existingApplication, body) {
    const { cv, cover, ...restBody } = body
    const updateData = { ...restBody }

    // Si se proporciona un nuevo CV, cargamos el nuevo y borramos el anterior
    if (cv) {
        const cvSlug = `applications/cv/${crypto.randomUUID()}.docx`
        const cvPdfSlug = `applications/cv/${crypto.randomUUID()}.pdf`
        const cvBuffer = await generateDocxFromJson(JSON.parse(cv));
        const cvPdfBuffer = await convertDocxToPdf(cvBuffer);

        await uploadFilesS3([
            {
                key: cvSlug,
                body: cvBuffer,
                contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            },
            { key: cvPdfSlug, body: cvPdfBuffer, contentType: 'application/pdf' }
        ])

        if (existingApplication.cvSlug) await deleteFileFromS3(existingApplication.cvSlug)
        if (existingApplication.cvPdfSlug) await deleteFileFromS3(existingApplication.cvPdfSlug)

        updateData.cvSlug = cvSlug
        updateData.cvPdfSlug = cvPdfSlug
    }


    // Si se proporciona un nuevo Cover, cargamos el nuevo y borramos el anterior
    if (cover) {
        const coverSlug = `applications/cover/${crypto.randomUUID()}.txt`
        await uploadFilesS3([{
            key: coverSlug,
            body: Buffer.from(cover),
            contentType: 'text/plain'
        }])
        await deleteFileFromS3(existingApplication.coverSlug)
        updateData.coverSlug = coverSlug
    }

    const updatedApplication = await updateApplication(existingApplication.id, updateData)

    const cvUrl = await getApplicationObjectSignedUrl(updatedApplication.cvSlug)
    const coverUrl = await getApplicationObjectSignedUrl(updatedApplication.coverSlug)
    const cvPdfUrl = await getApplicationObjectSignedUrl(updatedApplication.cvPdfSlug)

    return { ...updatedApplication, cvUrl, coverUrl, cvPdfUrl }
}


export async function deleteApplicationService(id, db) {
    const application = await findApplicationById(id, db)
    if (!application) throw new Error('Application not found')

    const deletedCount = await deleteApplication(id, db)

    if (deletedCount > 0) {
        if (application.cvSlug) await deleteFileFromS3(application.cvSlug)
        if (application.coverSlug) await deleteFileFromS3(application.coverSlug)
        if (application.cvPdfSlug) await deleteFileFromS3(application.cvPdfSlug)
    }


    return deletedCount
}