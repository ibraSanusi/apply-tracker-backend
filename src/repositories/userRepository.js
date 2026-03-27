import bcrypt from 'bcrypt'

export async function findUsers() {
    return 'hola desde el repositorio'
}

export async function insertUser(userData, db) {
    const { name, lastName, email, password } = userData
    const passwordHash = await bcrypt.hash(password, 10)
    const query = `
        INSERT INTO "User" ("name", "lastName", "email", "passwordHash", "createdAt", "updatedAt", "token", "tokenExpiry", "verifyToken", "verifyTokenExpiry", "isVerified", "recoveryToken", "recoveryTokenExpiry")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, "name", "lastName", "email", "createdAt", "updatedAt", "isVerified"
    `
    const result = await db.query(query, [name, lastName, email, passwordHash, new Date(), new Date(), null, null, null, null, true, null, null])
    return result.rows[0]
}
export async function findUserByEmail(email, db) {
    const user = await db.query(`
            SELECT * 
            FROM "User"
            WHERE email = $1
        `, [email])
    return user.rows[0]
}

export async function findUserById(id, db) {
    const user = await db.query(`
            SELECT * 
            FROM "User"
            WHERE id = $1
        `, [id])
    return user.rows[0]
}

export async function updateUserToken(userData, db) {
    const { id, token } = userData
    const query = `
        UPDATE "User"
        SET "token" = $1, "tokenExpiry" = $2
        WHERE "id" = $3
        RETURNING id, "name", "lastName", "email", "createdAt", "updatedAt", "isVerified", "token"
    `
    const tokenExpiry = new Date(new Date().getTime() + 60 * 60 * 3 * 1000) // 3 hours
    const result = await db.query(query, [token, tokenExpiry, id])
    return result.rows[0]
}

export async function updateVerifyToken(user, db) {
    const { id, verifyToken } = user
    const query = `
        UPDATE "User"
        SET "verifyToken" = $1, "verifyTokenExpiry" = $2
        WHERE "id" = $3
        RETURNING id, "name", "lastName", "email", "createdAt", "updatedAt", "isVerified", "token"
    `

    const verifyTokenExpiry = new Date(new Date().getTime() + 60 * 60 * 1 * 1000) // 1 hour
    const result = await db.query(query, [verifyToken, verifyTokenExpiry, id])
    return result.rows[0]
}

export async function updateRecoveryToken(data, db) {
    const { email, recoveryToken } = data
    const query = `
        UPDATE "User"
        SET "recoveryToken" = $1, "recoveryTokenExpiry" = $2
        WHERE "email" = $3
        RETURNING "recoveryToken"
    `

    const recoveryTokenExpiry = new Date(new Date().getTime() + 60 * 60 * 1 * 1000) // 1 hour
    const result = await db.query(query, [recoveryToken, recoveryTokenExpiry, email])
    return result.rows[0]
}

export async function setUserVerified(userId, db) {
    const query = `
        UPDATE "User"
        SET "isVerified" = $1, "verifyToken" = $2, "verifyTokenExpiry" = $3
        WHERE "id" = $4
        RETURNING "isVerified"
    `

    const result = await db.query(query, [true, null, null, userId])
    return result.rows[0]
}

export async function updatePassword({ userId, newPassword }, db) {
    const passwordHash = await bcrypt.hash(newPassword, 10)
    const query = `
        UPDATE "User"
        SET "passwordHash" = $1
        WHERE "id" = $2
        RETURNING "id"
    `

    const result = await db.query(query, [passwordHash, userId])
    return result.rows[0]
}

export async function resetUserRecoveryToken(userId, db) {
    const query = `
        UPDATE "User"
        SET "recoveryToken" = $1, "recoveryTokenExpiry" = $2
        WHERE "id" = $3
    `

    const result = await db.query(query, [null, null, userId])
    return result.updatedRows
}
