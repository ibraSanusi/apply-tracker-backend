import { 
    saveApplicationCtrl, 
    askChatCtrl, 
    validateUserCtrl, 
    getApplicationsCtrl,
    getApplicationByIdCtrl,
    updateApplicationCtrl,
    deleteApplicationCtrl
} from "../controllers/applicationController.js"
import { 
    saveApplicationSchema, 
    askChatSchema, 
    getApplicationsSchema,
    getApplicationByIdSchema,
    updateApplicationSchema,
    deleteApplicationSchema
} from "../schemas/applicationSchema.js"

async function applicationRoute(fastify) {
    fastify.addHook('preHandler', validateUserCtrl)

    fastify.post('/save', { schema: saveApplicationSchema }, saveApplicationCtrl)
    fastify.post('/chat', { schema: askChatSchema }, askChatCtrl)
    fastify.get('/get-all', { schema: getApplicationsSchema }, getApplicationsCtrl)
    
    fastify.get('/:id', { schema: getApplicationByIdSchema }, getApplicationByIdCtrl)
    fastify.put('/:id', { schema: updateApplicationSchema }, updateApplicationCtrl)
    fastify.delete('/:id', { schema: deleteApplicationSchema }, deleteApplicationCtrl)
}

export default applicationRoute