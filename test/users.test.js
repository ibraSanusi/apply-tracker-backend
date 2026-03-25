import { after, before, describe, it } from 'node:test'
import assert from 'node:assert'
import buildApp from '../src/app.js'

describe('Users', () => {
    let app
    let email = 'ibra@test.es'
    let password = '12345678'

    before(async () => {
        app = await buildApp()
    })

    after(async () => {
        await app.db.query('DELETE FROM "User" WHERE email = $1', [email])
        await app.close()
    })

    it('POST /users/register should register a new user', async () => {
        const payload = {
            name: 'Ibrahim',
            lastName: 'Sanusi',
            email,
            password,
        }

        const response = await app.inject({
            method: 'POST',
            url: '/users/register',
            payload
        })

        const { data } = JSON.parse(response.body)
        assert.strictEqual(data.email, payload.email)
    })

    it('POST /users/login should login a user', async () => {
        const payload = {
            email,
            password,
        }

        const response = await app.inject({
            method: 'POST',
            url: '/users/login',
            payload,
        })

        const { data, token } = JSON.parse(response.body)

        assert.strictEqual(data.email, email)
        assert.strictEqual(response.statusCode, 200)

        const foundUser = await app.db.query('SELECT * FROM "User" WHERE email = $1', [email])
        assert.strictEqual(foundUser.rows[0].token, token)
        assert.ok(foundUser.rows[0].tokenExpiry > new Date())
    })
})