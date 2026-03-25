import bcrypt from 'bcrypt'

export async function findUsers() {
    return 'hola desde el repositorio'
}

export async function insertUser(userData, db) {
    const { name, lastName, email, password } = userData
    const passwordHash = await bcrypt.hash(password, 10)
    const query = `
        INSERT INTO "User" ("name", "lastName", "email", "passwordHash", "createdAt", "updatedAt", "token", "tokenExpiry", "isVerified", "recoveryToken", "recoveryTokenExpiry")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, "name", "lastName", "email", "createdAt", "updatedAt", "isVerified"
    `
    const result = await db.query(query, [name, lastName, email, passwordHash, new Date(), new Date(), null, null, true, null, null])
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