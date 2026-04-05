import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { findUsers, insertUser, findUserByEmail, updateUserToken, updateVerifyToken, findUserById, setUserVerified, updateRecoveryToken, updatePassword, resetUserRecoveryToken } from "../repositories/userRepository.js"
import { sendEmail, sendVerificationTokenMail } from '../utils/mailSender.js'
import { recoveryHtml } from '../utils/htmlTemplates.js'

dotenv.config()

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