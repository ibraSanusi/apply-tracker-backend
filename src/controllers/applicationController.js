import { saveApplicationService } from "../services/applicationService.js"
import { validateUser } from "../services/userService.js"

export async function saveApplicationCtrl(request, reply) {
    const user = await validateUser(request.headers.authorization, request.server.db)
    try {
        const data = await saveApplicationService({ ...request.body, userId: user.id }, request.server.db)
        reply.code(201).send({ data, message: 'Application saved correctly' })
    } catch (error) {
        console.log('Application saving (Error): ', error)
        reply.code(500).send({ message: 'Error saving application' })
    }
}