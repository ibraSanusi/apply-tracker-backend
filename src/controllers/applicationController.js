import { getApplicationsService, saveApplicationService, getApplicationByIdService, updateApplicationService, deleteApplicationService } from "../services/applicationService.js"
import { validateUser } from "../services/userService.js"
import { askChatService } from '../services/applicationService.js'

export async function saveApplicationCtrl(request, reply) {
    try {
        const data = await saveApplicationService({ ...request.body, userId: request.user.id }, request.server.db)
        reply.code(201).send({ data, message: 'Application saved correctly' })
    } catch (error) {
        console.error('Application saving (Error): ', error)
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
        console.error('askChat(error): ', error)
        return reply.code(500).send({ message: 'Error while asking Chat GPT' })
    }
}

export async function getApplicationsCtrl(request, reply) {
    try {
        const applications = await getApplicationsService(request.user.id, request.server.db)
        reply.code(200).send({ data: applications })
    } catch (error) {
        console.error('Error getting applications: ', error)
        reply.code(500).send({ message: 'Error getting applications' })
    }
}

export async function getApplicationByIdCtrl(request, reply) {
    try {
        const { id } = request.params
        const application = await getApplicationByIdService(id, request.server.db)

        if (!application) {
            return reply.code(404).send({ message: 'Application not found' })
        }

        if (application.userId && application.userId !== request.user.id) {
            return reply.code(403).send({ message: 'No tienes permiso para ver esta aplicación' })
        }

        reply.code(200).send({ data: application })
    } catch (error) {
        console.error('Error getting application by ID: ', error)
        reply.code(500).send({ message: 'Error getting application' })
    }
}

export async function updateApplicationCtrl(request, reply) {
    try {
        const { id } = request.params
        const data = request.body

        const existing = await getApplicationByIdService(id, request.server.db)
        if (!existing) {
            return reply.code(404).send({ message: 'Application not found' })
        }
        if (existing.userId && existing.userId !== request.user.id) {
            return reply.code(403).send({ message: 'No tienes permiso para editar esta aplicación' })
        }

        const updated = await updateApplicationService(existing, data)
        reply.code(200).send({ data: updated, message: 'Application updated correctly' })
    } catch (error) {
        console.error('Error updating application: ', error)
        reply.code(500).send({ message: 'Error updating application' })
    }
}

export async function deleteApplicationCtrl(request, reply) {
    try {
        const { id } = request.params

        const existing = await getApplicationByIdService(id, request.server.db)
        if (!existing) {
            return reply.code(404).send({ message: 'Application not found' })
        }
        if (existing.userId && existing.userId !== request.user.id) {
            return reply.code(403).send({ message: 'No tienes permiso para borrar esta aplicación' })
        }

        await deleteApplicationService(id, request.server.db)
        reply.code(200).send({ message: 'Application deleted correctly' })
    } catch (error) {
        console.error('Error deleting application: ', error)
        reply.code(500).send({ message: 'Error deleting application' })
    }
}

