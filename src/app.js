import Fastify from 'fastify'
import usersRoutes from './routes/usersRoutes.js'
import db from './db.js'

export async function buildApp(opts = {}) {
    const app = Fastify(opts)
    app.decorate('db', db)
    await app.register(usersRoutes, { prefix: '/users' })
    return app
}

export default buildApp