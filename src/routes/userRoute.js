import { registerCtrl, loginCtrl, verifyEmailCtrl, sendVerificationEmailCtrl, sendRecoveryMailCtrl, recoverPasswordCtrl } from "../controllers/userController.js"
import { registerSchema, loginSchema, verifyEmailSchema, sendVerificationEmailSchema, sendRecoveryMailSchema, recoverPasswordSchema } from "../schemas/userSchema.js"

async function userRoute(fastify) {
    fastify.post('/register', { schema: registerSchema }, registerCtrl)
    fastify.post('/send-verification-mail', { schema: sendVerificationEmailSchema }, sendVerificationEmailCtrl)
    fastify.post('/verify-email', { schema: verifyEmailSchema }, verifyEmailCtrl)
    fastify.post('/send-recovery-mail', { schema: sendRecoveryMailSchema }, sendRecoveryMailCtrl)
    fastify.post('/confirm-password', { schema: recoverPasswordSchema }, recoverPasswordCtrl)
    fastify.post('/login', { schema: loginSchema }, loginCtrl)
}

export default userRoute