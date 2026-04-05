import { insertApplication } from "../repositories/applicationRepository.js"
import 'dotenv/config.js'
import OpenAI from 'openai';
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

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
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

export async function askChatService(chatInput, cvTemplate) {
    const completion = await openaiClient.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
            {
                role: 'system',
                content: `Eres un asistente especializado en selección de personal y redacción de CVs.
                Recibirás una oferta de trabajo y un CV base del candidato.
                
                Tu tarea es:
                1. Extraer la información clave de la oferta (empresa, puesto, email, salario, medio de contacto).
                2. Adaptar el CV para maximizar su relevancia frente a la oferta, sin inventar experiencia.
                3. Generar una carta de presentación personalizada y convincente.
                
                Reglas para adaptar el CV:
                - Mantén todos los logros concretos del CV original, especialmente integraciones con sistemas externos, cumplimiento normativo o trabajo con terceros.
                - Reencuadra la experiencia existente como transferible cuando sea relevante para los requisitos del puesto.
                - Incluye las keywords exactas de la oferta en el CV, especialmente tecnologías y requisitos obligatorios.
                - Si el candidato no tiene experiencia directa con una tecnología requerida, no lo menciones explícitamente. Usa la experiencia más cercana como puente.
                
                Reglas para la carta de presentación:
                - Menciona al menos un logro concreto del CV que conecte directamente con el sector o los requisitos del puesto.
                - Evita frases genéricas sin contenido real.
                - Adapta el tono al sector de la empresa si es identificable.
                
                Devuelve ÚNICAMENTE un objeto JSON válido, sin markdown ni explicaciones.
                Si un campo no aparece en la oferta, devuelve null.`
            },
            {
                role: 'assistant',
                content: JSON.stringify({
                    company: "Crescenta",
                    position: "Junior Full-Stack Developer",
                    email: "talento@crescenta.com",
                    salary: 24000,
                    medium: null,
                    cv: {
                        name: "string",
                        title: "string",
                        location: "string",
                        contact: { email: "string", github: "string", linkedin: "string" },
                        profile: "string",
                        experience: [{ company: "string", role: "string", period: "string", bullets: ["string"] }],
                        education: [{ title: "string", center: "string", location: "string" }],
                        skills: { frontend: ["string"], backend: ["string"], testing: ["string"] },
                        additional: "string"
                    },
                    cover: "texto plano de la carta de presentación"
                })
            },
            {
                role: 'user',
                content: `Oferta de trabajo:\n${chatInput}\n\nMi CV base:\n${cvTemplate}`
            },
        ],
    });

    const raw = completion.choices[0].message.content
    return JSON.parse(raw)
}