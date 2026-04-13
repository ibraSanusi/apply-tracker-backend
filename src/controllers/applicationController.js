import { getApplicationsService, saveApplicationService } from "../services/applicationService.js"
import { validateUser } from "../services/userService.js"
import { askChatService } from '../services/applicationService.js'

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
    reply.header('Transfer-Encoding', 'chunked')
    reply.header('Content-Type', 'application/octet-stream')

    try {
        const { jobDescription, cvTemplate } = request.body

        const stream = await askChatService({ jobDescription, cvTemplate })

        return reply
            .code(200)
            .send(stream)
    } catch (error) {
        console.log('askChat(error): ', error)
        return reply.code(500).send({ message: 'Error while asking Chat GPT' })
    }
}

export async function getApplicationsCtrl(request, reply) {
    try {
        const applications = await getApplicationsService(request.user.id, request.server.db)
        reply.code(200).send({ data: applications })
    } catch (error) {
        console.log('Error getting applications: ', error)
        reply.code(500).send({ message: 'Error getting applications' })
    }
}

