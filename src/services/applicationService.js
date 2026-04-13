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
    const { coverSlug, cvSlug } = await uploadApplicationMediaS3({ cv, cover })
    const application = await insertApplication({ coverSlug, cvSlug, ...restBody }, db)

    const coverUrl = await getApplicationObjectSignedUrl(coverSlug)
    const cvUrl = await getApplicationObjectSignedUrl(cvSlug)

    return { ...application, cvUrl, coverUrl }
}

async function uploadTextFiles(files) {
    if (process.env.NODE_ENV === 'test') {
        return files.map((file, idx) => ({ key: file.key, location: `${file.key}${idx + 1}` }))
    }

    return await Promise.all(files.map(async file => {
        const { key, body } = file

        return await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: key,
                Body: Buffer.from(body),
                ContentType: 'text/plain',
                ContentDisposition: 'inline',
            }),
        )
    }))
}

export async function uploadApplicationMediaS3({ cv, cover }) {
    const cvSlug = `applications/cv/${crypto.randomUUID()}.txt`
    const coverSlug = `applications/cover/${crypto.randomUUID()}.txt`

    const [cvUpload, coverUpload] = await uploadTextFiles([
        { key: cvSlug, body: cv },
        { key: coverSlug, body: cover }
    ])

    if (!cvUpload || !coverUpload) { throw new Error('Error uploading cover and cv to AWS') } // probablemente borrar el archivo que se llego a crear

    return { cvSlug, coverSlug }
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
            { role: 'user', content: `Job Description:\n${jobDescription}\n\nMy Base CV:\n${cvTemplate}\n\nResponse format instructions:\n${applicationChatResponseFormat}` },
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
    const applications = await getApplications(userId, db)
    return await Promise.all(applications.map(async application => {
        const cvUrl = await getApplicationObjectSignedUrl(application.cvSlug)
        const coverUrl = await getApplicationObjectSignedUrl(application.coverSlug)
        return { ...application, cvUrl, coverUrl }
    }))
}

export async function getApplicationByIdService(id, db) {
    const application = await findApplicationById(id, db)
    if (!application) return null

    const cvUrl = await getApplicationObjectSignedUrl(application.cvSlug)
    const coverUrl = await getApplicationObjectSignedUrl(application.coverSlug)

    return { ...application, cvUrl, coverUrl }
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

export async function updateApplicationService(id, body, db) {
    const existingApplication = await findApplicationById(id, db)
    if (!existingApplication) throw new Error('Application not found')

    const { cv, cover, ...restBody } = body
    const updateData = { ...restBody }

    // Si se proporciona un nuevo CV, cargamos el nuevo y borramos el anterior
    if (cv) {
        const cvSlug = `applications/cv/${crypto.randomUUID()}.txt`
        await uploadTextFiles([{ key: cvSlug, body: cv }])
        await deleteFileFromS3(existingApplication.cvSlug)
        updateData.cvSlug = cvSlug
    }

    // Si se proporciona un nuevo Cover, cargamos el nuevo y borramos el anterior
    if (cover) {
        const coverSlug = `applications/cover/${crypto.randomUUID()}.txt`
        await uploadTextFiles([{ key: coverSlug, body: cover }])
        await deleteFileFromS3(existingApplication.coverSlug)
        updateData.coverSlug = coverSlug
    }

    const updatedApplication = await updateApplication(id, updateData, db)

    const cvUrl = await getApplicationObjectSignedUrl(updatedApplication.cvSlug)
    const coverUrl = await getApplicationObjectSignedUrl(updatedApplication.coverSlug)

    return { ...updatedApplication, cvUrl, coverUrl }
}

export async function deleteApplicationService(id, db) {
    const application = await findApplicationById(id, db)
    if (!application) throw new Error('Application not found')

    const deletedCount = await deleteApplication(id, db)

    if (deletedCount > 0) {
        await deleteFileFromS3(application.cvSlug)
        await deleteFileFromS3(application.coverSlug)
    }

    return deletedCount
}