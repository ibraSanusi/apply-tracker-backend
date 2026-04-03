import { after, before, describe, it } from 'node:test'
import { uploadApplicationMediaS3 } from '../src/services/applicationService.js'
import buildApp from '../src/app.js'
import { loginUser, registerUser } from './utils.js'
import assert from 'node:assert'
import { deleteUserByEmail } from '../src/repositories/userRepository.js'
import { deleteApplication, findApplicationById } from '../src/repositories/applicationRepository.js'

describe('Application', () => {
    let app
    let applicationId
    let email = 'ibra@application.es'
    let password = '12345678'

    before(async () => {
        app = await buildApp()
        process.env.NODE_ENV = 'test'
    })

    after(async () => {
        await deleteApplication(applicationId, app.db)
        await deleteUserByEmail(email, app.db)
        await app.close()
    })

    describe('Application uploadApplicationMediaS3', () => {
        it('should upload cv to S3 service', async () => {
            const payload = {
                cv: 'Esta es mi experiencia',
                cover: 'Esta es mi motivación'
            }

            const { cvSlug, coverSlug } = await uploadApplicationMediaS3(payload)

            assert.ok(typeof cvSlug === 'string')
            assert.ok(typeof coverSlug === 'string')
        })
    })

    describe('POST /save', () => {
        it('it should save application correctly', async () => {
            const payload = {
                company: 'Google S.A',
                position: 'Lead Fullstack',
                cv: 'Esta es mi experiencia',
                cover: 'Esta es mi motivación'
            }

            await registerUser({ email, password }, app)
            const loginResponse = await loginUser({ email, password }, app)
            const user = JSON.parse(loginResponse.body)

            const response = await app.inject({
                method: 'POST',
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
                url: '/application/save',
                payload
            })

            const result = JSON.parse(response.body).data
            const { id } = result

            applicationId = id

            const application = await findApplicationById(id, app.db)
            assert.strictEqual(id, application.id)
        })
    })
})