import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { findUsers, insertUser, findUserByEmail, updateUserToken } from "../repositories/userRepository.js"

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