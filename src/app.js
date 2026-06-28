import Fastify from 'fastify'
import userRoute from './routes/userRoute.js'
import db from './db.js'
import applicationRoute from './routes/applicationRoute.js'
import cors from '@fastify/cors'

export async function buildApp(opts = {}) {
    const app = Fastify(opts)
    app.decorate('db', db)
    await app.register(cors, {
        origin: (origin, cb) => {
            if (!origin) {
                cb(null, true)
                return
            }
            try {
                const hostname = new URL(origin).hostname
                if (hostname === "localhost" || hostname === import.meta.env.FRONTEND_URL) {
                    cb(null, true)
                    return
                }
            } catch (err) {
                // Fall through to not allowed
            }
            cb(new Error("Not allowed"), false)
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Asegúrate de incluir DELETE
    })
    await app.register(userRoute, { prefix: '/users' })
    await app.register(applicationRoute, { prefix: '/applications' })
    return app
}

export default buildApp