import buildApp from './app.js'

async function run() {
    const server = await buildApp({
        logger: {
            level: 'info',
            transport: {
                target: 'pino-pretty'
            }
        }
    })

    server.listen({ port: 3000 }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
}

run()