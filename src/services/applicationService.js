import { insertApplication } from "../repositories/applicationRepository.js"
import {
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import 'dotenv/config.js'
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Set the creadential of aws
const s3Client = new S3Client({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_kEY,
        secretAccessKey: process.env.AWS_SECRET_S3_kEY,
    },
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
    if (process.env.NODE_ENV === 'test') return files.map((file, idx) => `${file.key}${idx + 1}`)
    return await files.map(async file => {
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
    })
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