import { saveApplicationCtrl, askChatCtrl, validateUserCtrl, getApplicationsCtrl } from "../controllers/applicationController.js"
import { saveApplicationSchema, askChatSchema, getApplicationsSchema } from "../schemas/applicationSchema.js"

async function applicationRoute(fastify) {
    fastify.addHook('preHandler', validateUserCtrl)

    fastify.post('/save', { schema: saveApplicationSchema }, saveApplicationCtrl)
    fastify.post('/chat', { schema: askChatSchema }, askChatCtrl)
    fastify.get('/get-all', { schema: getApplicationsSchema }, getApplicationsCtrl)
}

export default applicationRoute