import { wellcomeCtrl, registerCtrl, loginCtrl } from "../controllers/userController.js"
import { registerSchema, loginSchema } from "../schemas/userSchema.js"

async function usersRoutes(fastify) {
    fastify.get('/', wellcomeCtrl)
    fastify.post('/register', { schema: registerSchema }, registerCtrl)
    fastify.post('/login', { schema: loginSchema }, loginCtrl)
}

export default usersRoutes