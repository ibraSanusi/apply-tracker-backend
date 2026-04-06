import { after, before, describe, it } from 'node:test'
import { uploadApplicationMediaS3 } from '../src/services/applicationService.js'
import buildApp from '../src/app.js'
import { loginUser, registerUser } from './utils.js'
import assert from 'node:assert'
import { deleteUserByEmail } from '../src/repositories/userRepository.js'
import { deleteApplication, findApplicationById } from '../src/repositories/applicationRepository.js'
import { cvTemplate, jobDescription } from '../src/utils/constants.js'

describe('Application', () => {
    let app
    let applicationId
    let email = 'ibra@application.es'
    let password = '12345678'
    let authorizationHeader

    before(async () => {
        app = await buildApp()
        process.env.NODE_ENV = 'test'

        await registerUser({ email, password }, app)
        const loginResponse = await loginUser({ email, password }, app)
        const user = JSON.parse(loginResponse.body)
        authorizationHeader = {
            authorization: `Bearer ${user.token}`,
        }
    })

    after(async () => {
        await deleteApplication(applicationId, app.db)
        await deleteUserByEmail(email, app.db)
        await app.close()
    })

    it('should upload cv to S3 service', async () => {
        const payload = {
            cv: 'Esta es mi experiencia',
            cover: 'Esta es mi motivación'
        }

        const { cvSlug, coverSlug } = await uploadApplicationMediaS3(payload)

        assert.ok(typeof cvSlug === 'string')
        assert.ok(typeof coverSlug === 'string')
    })

    it('should chat correctly', async () => {
        const chatResponse = await app.inject({
            method: 'POST',
            headers: authorizationHeader,
            url: '/application/chat',
            payload: { cvTemplate, jobDescription },
        })

        assert.equal(chatResponse.statusCode, 200)
        assert.equal(chatResponse.headers['content-type'], 'text/event-stream')
    })

    it('should save correctly', async () => {
        const payload = {
            company: 'Google',
            position: 'Developer',
            cv: 'mi cv',
            cover: 'mi cover'
        }

        const saveResponse = await app.inject({
            method: 'POST',
            headers: authorizationHeader,
            url: '/application/save',
            payload
        })

        const result = JSON.parse(saveResponse.body).data
        const { id } = result

        applicationId = id

        const application = await findApplicationById(id, app.db)
        assert.strictEqual(id, application.id)
    })
})