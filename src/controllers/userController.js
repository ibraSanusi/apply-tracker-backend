import { getAllUsersService, registerUserService, loginUserService } from "../services/userService.js"

export async function wellcomeCtrl(request, reply) {
    const user = await getAllUsersService()
    reply.send({ data: user })
}

export async function registerCtrl(request, reply) {
    try {
        const user = await registerUserService(request.body, request.server.db)
        reply.code(201).send({ data: user })
    } catch (error) {
        reply.code(500).send({ message: 'Error registering user' })
    }
}

export async function loginCtrl(request, reply) {
    try {
        const { payload, jwtToken } = await loginUserService(request.body, request.server.db)
        if (!payload) {
            reply.code(401).send({ message: 'Invalid credentials' })
        }
        reply.send({ data: payload, token: jwtToken })
    } catch (error) {
        reply.code(500).send({ message: 'Error logging in' })
    }
}