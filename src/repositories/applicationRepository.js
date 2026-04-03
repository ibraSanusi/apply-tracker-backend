import { insert } from "../utils/db.js"

export async function insertApplication(application, db) {
    return await insert({ data: application, model: 'JobApplication' }, db)
}

export async function deleteApplication(id, db) {
    const result = await db.query('DELETE FROM "JobApplication" WHERE id = $1', [id])
    return result.rowCount
}

export async function findApplicationById(id, db) {
    const query = `
        SELECT * 
        FROM "JobApplication" 
        WHERE id = $1 
    `
    const result = await db.query(query, [id])
    return result.rows[0]
}