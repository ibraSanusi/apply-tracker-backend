import { after, before, describe, it, mock } from 'node:test'
import libreoffice from 'libreoffice-convert'
import { uploadApplicationMediaS3 } from '../src/services/applicationService.js'
import buildApp from '../src/app.js'
import { loginUser, registerUser } from './utils.js'
import assert from 'node:assert'
import { deleteUserByEmail } from '../src/repositories/userRepository.js'
import { deleteApplication, findApplicationById } from '../src/repositories/applicationRepository.js'
import { cvTemplate, jobDescription, sampleCV } from '../src/utils/constants.js'

describe('Application', () => {
    let app
    let applicationId
    let email = 'ibra@application.es'
    let password = '12345678'
    let authorizationHeader

    before(async () => {
        app = await buildApp()
        process.env.NODE_ENV = 'test'

        mock.method(libreoffice, 'convert', (buffer, format, options, callback) => {
            callback(null, Buffer.from('mock pdf content'))
        })

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
            cv: JSON.stringify(sampleCV),
            cover: 'Esta es mi motivación'
        }

        const { cvSlug, coverSlug, cvPdfSlug } = await uploadApplicationMediaS3(payload)

        assert.ok(typeof cvSlug === 'string')
        assert.ok(typeof coverSlug === 'string')
        assert.ok(typeof cvPdfSlug === 'string')
    })


    it.skip('should chat correctly', async () => {
        const chatResponse = await app.inject({
            method: 'POST',
            headers: authorizationHeader,
            url: '/applications/chat',
            payload: { cvTemplate, jobDescription },
        })

        assert.equal(chatResponse.statusCode, 200)
        assert.equal(chatResponse.headers['transfer-encoding'], 'chunked')
        assert.equal(chatResponse.headers['content-type'], 'application/octet-stream')
    })

    it('should save correctly', async () => {
        const payload = {
            company: 'Google',
            position: 'Developer',
            cv: JSON.stringify(sampleCV),
            cover: 'mi cover'
        }

        const saveResponse = await app.inject({
            method: 'POST',
            headers: authorizationHeader,
            url: '/applications/save',
            payload
        })

        const result = JSON.parse(saveResponse.body).data
        const { id } = result

        applicationId = id

        const application = await findApplicationById(id, app.db)
        assert.strictEqual(id, application.id)
        assert.ok(application.cvSlug, 'cvSlug should exist')
        assert.ok(application.coverSlug, 'coverSlug should exist')
        assert.ok(application.cvPdfSlug, 'cvPdfSlug should exist')
    })


    it('should get applications correctly', async () => {
        const applicationsResponse = await app.inject({
            method: 'GET',
            headers: authorizationHeader,
            url: '/applications/get-all',
        })

        const result = JSON.parse(applicationsResponse.body).data
        assert.ok(Array.isArray(result))
        assert.ok(result.length > 0)
    })

    it('should get application by id correctly', async () => {
        const response = await app.inject({
            method: 'GET',
            headers: authorizationHeader,
            url: `/applications/${applicationId}`,
        })

        assert.strictEqual(response.statusCode, 200)
        const result = JSON.parse(response.body).data
        assert.strictEqual(result.id, applicationId)

        assert.ok(result.cvUrl)
        assert.ok(result.coverUrl)
        assert.ok(result.cvPdfUrl)
    })


    it('should update application correctly', async () => {
        const newPosition = 'Senior Developer'
        const response = await app.inject({
            method: 'PUT',
            headers: authorizationHeader,
            url: `/applications/${applicationId}`,
            payload: {
                position: newPosition,
                cv: JSON.stringify(sampleCV),
                cover: 'mi cover'
            }
        })

        assert.strictEqual(response.statusCode, 200)
        const result = JSON.parse(response.body).data
        assert.strictEqual(result.position, newPosition)

        assert.ok(result.cvUrl)
        assert.ok(result.cvPdfUrl)
    })


    it('should delete application correctly', async () => {
        const response = await app.inject({
            method: 'DELETE',
            headers: authorizationHeader,
            url: `/applications/${applicationId}`,
        })

        assert.strictEqual(response.statusCode, 200)

        // Verificar que ya no existe
        const getResponse = await app.inject({
            method: 'GET',
            headers: authorizationHeader,
            url: `/applications/${applicationId}`,
        })
        assert.strictEqual(getResponse.statusCode, 404)
    })
})