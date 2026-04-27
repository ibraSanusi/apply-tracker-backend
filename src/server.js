import buildApp from './app.js'

async function run() {
    if (!process.env.IS_DOCKER) {
        console.error("❌ ERROR: Este proyecto debe ejecutarse mediante Docker.");
        console.error("Usa: docker compose up");
        process.exit(1);
    }

    const server = await buildApp({
        logger: {
            level: 'info',
            transport: {
                target: 'pino-pretty'
            }
        }
    })

    server.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
}

run()