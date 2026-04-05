import { saveApplicationService } from "../services/applicationService.js"
import { askChatService, validateUser } from "../services/userService.js"

export async function saveApplicationCtrl(request, reply) {
    try {
        const data = await saveApplicationService({ ...request.body, userId: request.user.id }, request.server.db)
        reply.code(201).send({ data, message: 'Application saved correctly' })
    } catch (error) {
        console.log('Application saving (Error): ', error)
        reply.code(500).send({ message: 'Error saving application' })
    }
}
export async function validateUserCtrl(request, reply) {
    const user = await validateUser(request.headers.authorization, request.server.db)
    if (!user) return reply.code(401).send({ message: 'Usuario no autorizado', request })
    request.user = user
}

export async function askChatCtrl(request, reply) {
    try {
        const chatResponse = askChatService(request.body.chat)
        return reply.code(200).send({ data: chatResponse, message: 'Openai responded correctly' })
    } catch (error) {
        console.log('askChat(error): ', error)
        return reply.code(500).send({ message: 'Error while asking Chat GPT' })
    }
}

