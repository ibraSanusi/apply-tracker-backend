import { registerUserService, loginUserService, sendVerificationTokenService, verifyEmailService, sendRecoveryMailService, recoverPasswordService } from "../services/userService.js"

export async function registerCtrl(request, reply) {
    try {
        const user = await registerUserService(request.body, request.server.db)
        const verifyToken = await sendVerificationTokenService(user, request.server.db)

        reply.code(201).send({ data: { ...user, verifyToken } })
    } catch (error) {
        console.log('registerCtrl(error): ', error)
        reply.code(500).send({ message: 'Error registering user' })
    }
}

export async function verifyEmailCtrl(request, reply) {
    try {
        await verifyEmailService(request.body, request.server.db)
        reply.code(200).send({ message: 'Email verified correctly' })
    } catch (error) {
        console.error('verifyEmail error:', error)
        reply.code(500).send({ message: 'Error verifying email' })
    }
}

export async function sendVerificationEmailCtrl(request, reply) {
    try {
        await sendVerificationTokenService(request.body, request.server.db)
        reply.code(200).send({ message: 'Se envío el enlace de verificación. Compruebe su mail' })
    } catch (error) {
        reply.code(500).send({ message: 'Error sending mail user' })
    }

}

export async function loginCtrl(request, reply) {
    try {
        const result = await loginUserService(request.body, request.server.db)
        if (!result) {
            return reply.code(401).send({ message: 'Invalid credentials' })
        }
        const { payload, jwtToken } = result
        reply.send({ data: payload, token: jwtToken })
    } catch (error) {
        reply.code(500).send({ message: 'Error logging in' })
    }
}

export async function sendRecoveryMailCtrl(request, reply) {
    try {
        await sendRecoveryMailService(request.body, request.server.db)
        reply.code(200).send({ message: 'Se envio el enlace de recuperación. Compruebe su mail' })
    } catch (error) {
        console.log('Error enviando mail de recuperación: ', error)
        reply.code(500).send({ message: 'Error enviando mail de recuperación' })
    }
}

export async function recoverPasswordCtrl(request, reply) {
    try {
        await recoverPasswordService(request.body, request.server.db)
        reply.code(200).send({ message: 'Contraseña actualizada correctamente' })
    } catch (error) {
        reply.code(500).send({ message: 'Error actualizando contraseña' })
    }
}