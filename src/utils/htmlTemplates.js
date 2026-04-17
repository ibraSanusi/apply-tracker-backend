const recoveryHtml = (token, email) => {
    return `
            <h1>Email de recuperación</h1>
            <p>Clickea en el enlace para recuperar tu contraseña</p>
            <a href="${process.env.FRONT_URL ?? 'http://localhost:5173'}/recovery-password?recoveryToken=${token}&email=${email}">
                Recuperar contraseña
            </a>
        `
}

const verificationHtml = (token) => {
    return `
            <h1>Email de verificación</h1>
            <p>Clickea en el enlace para verificar tu mail</p>
            <a href="${process.env.FRONT_URL}/verify-email?verificationMail=${token}">
                Verificar email
            </a>
        `
}

export { recoveryHtml, verificationHtml }