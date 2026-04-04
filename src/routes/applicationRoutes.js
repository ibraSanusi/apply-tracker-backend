import { saveApplicationCtrl, createApplicationCtrl, validateUserCtrl } from "../controllers/applicationController.js"
import { saveApplicationSchema, createApplicationSchema } from "../schemas/applicationSchema.js"

async function applicationRoutes(fastify) {
    fastify.addHook('preHandler', validateUserCtrl)

    fastify.post('/save', { schema: saveApplicationSchema }, saveApplicationCtrl)
    // fastify.post('/send-verification-mail', { schema: sendVerificationEmailSchema }, sendVerificationEmailCtrl)
}

export default applicationRoutes