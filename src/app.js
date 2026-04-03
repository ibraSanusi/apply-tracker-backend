import Fastify from 'fastify'
import userRoutes from './routes/userRoutes.js'
import db from './db.js'
import applicationRoutes from './routes/applicationRoutes.js'

export async function buildApp(opts = {}) {
    const app = Fastify(opts)
    app.decorate('db', db)
    await app.register(userRoutes, { prefix: '/users' })
    await app.register(applicationRoutes, { prefix: '/application' })
    return app
}

export default buildApp