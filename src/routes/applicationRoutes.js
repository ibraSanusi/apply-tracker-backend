import { saveApplicationCtrl } from "../controllers/applicationController.js"
import { saveApplicationSchema } from "../schemas/applicationSchema.js"

async function applicationRoutes(fastify) {
    // create cover
    fastify.post('/save', { schema: saveApplicationSchema }, saveApplicationCtrl)
    // fastify.post('/send-verification-mail', { schema: sendVerificationEmailSchema }, sendVerificationEmailCtrl)
}

export default applicationRoutes