import { describe, it } from 'node:test'
import assert from 'node:assert'
import db from '../src/db.js'

describe('Database', () => {
    it('should connect to the database and insert a user', async () => {
        const client = await db.connect()

        try {
            await client.query('BEGIN')

            const insertResult = await client.query(`
                INSERT INTO "User" ("email", "name", "lastName", "passwordHash", "isVerified", "createdAt", "updatedAt", "token", "tokenExpiry", "recoveryToken", "recoveryTokenExpiry")
                VALUES ('test@test.com', 'ibrahim', 'sanusi', '1234567890', false, NOW(), NOW(), NULL, NULL, NULL, NULL)
                RETURNING id
            `)

            const { id } = insertResult.rows[0]

            const queryResult = await client.query('SELECT * FROM "User" WHERE id = $1', [id])

            assert.strictEqual(queryResult.rows[0].email, 'test@test.com')
            assert.strictEqual(queryResult.rows[0].name, 'ibrahim')
            assert.strictEqual(queryResult.rows[0].lastName, 'sanusi')
            assert.strictEqual(queryResult.rows[0].passwordHash, '1234567890')
            assert.strictEqual(queryResult.rows[0].isVerified, false)
            assert.strictEqual(queryResult.rows[0].token, null)
            assert.strictEqual(queryResult.rows[0].tokenExpiry, null)
            assert.strictEqual(queryResult.rows[0].recoveryToken, null)
            assert.strictEqual(queryResult.rows[0].recoveryTokenExpiry, null)

            await client.query('ROLLBACK') // Limpia sin dejar datos de prueba
        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        } finally {
            client.release()
        }
    })
})