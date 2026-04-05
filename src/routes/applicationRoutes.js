import { saveApplicationCtrl, askChatCtrl, validateUserCtrl } from "../controllers/applicationController.js"
import { saveApplicationSchema, askChatSchema } from "../schemas/applicationSchema.js"

async function applicationRoutes(fastify) {
    fastify.addHook('preHandler', validateUserCtrl)

    fastify.post('/save', { schema: saveApplicationSchema }, saveApplicationCtrl)
    fastify.post('/chat', { schema: askChatSchema }, askChatCtrl)
}

export default applicationRoutes