import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { findUsers, insertUser, findUserByEmail, updateUserToken, updateVerifyToken, findUserById, setUserVerified, updateRecoveryToken, updatePassword, resetUserRecoveryToken } from "../repositories/userRepository.js"
import { sendEmail, sendVerificationTokenMail } from '../utils/mailSender.js'
import { recoveryHtml } from '../utils/htmlTemplates.js'
import OpenAI from 'openai';

dotenv.config()

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function getAllUsersService() {
    return await findUsers()
}

export async function registerUserService(userData, db) {
    return await insertUser(userData, db)
}

export async function loginUserService(userData, db) {
    const user = await findUserByEmail(userData.email, db)
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(userData.password, user.passwordHash)
    if (!isPasswordValid) return null

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        isVerified: user.isVerified,
    }

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' })

    await updateUserToken({ id: user.id, token: jwtToken }, db)

    return { payload, jwtToken }
}

export async function sendVerificationTokenService(user, db) {
    const verifyToken = crypto.randomUUID()
    await updateVerifyToken({ id: user.id, verifyToken }, db)
    sendVerificationTokenMail({ email: user.email, token: verifyToken })

    return verifyToken
}

export async function verifyEmailService({ token, userId }, db) {
    const user = await findUserById(userId, db)
    if (Date(user.verifyTokenExpiry) < Date.now() || user.verifyToken !== token) throw new Error("Token undefined or expired");

    await setUserVerified(userId, db)
}

export async function sendRecoveryMailService(data, db) {
    const user = await findUserByEmail(data.email, db)
    if (!user) throw new Error('User not found')

    const token = crypto.randomUUID()
    await updateRecoveryToken({ email: user.email, recoveryToken: token }, db)
    sendEmail({ to: user.email, html: recoveryHtml(token), subject: 'Recupera tu contraseña' })
}

export async function recoverPasswordService(data, db) {
    const { token: recoveryToken, email, newPassword } = data
    const user = await findUserByEmail(email, db)

    if (!user) throw new Error('Error cambiando contraseña')

    const isValid = user.recoveryToken === recoveryToken && new Date() < user.recoveryTokenExpiry
    if (!isValid) throw new Error('Error cambiando contraseña')

    await updatePassword({ userId: user.id, newPassword }, db)
    await resetUserRecoveryToken(user.id, db)
}

export async function validateUser(authorization, db) {
    if (!authorization?.startsWith('Bearer ')) {
        throw new Error('Invalid credentials')
    }

    const token = authorization.split(' ')[1]

    let tokenDecoded
    try {
        tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new Error('Invalid session')
    }

    const user = await findUserByEmail(tokenDecoded.email, db)

    if (!user) throw new Error('Invalid session')

    return user
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