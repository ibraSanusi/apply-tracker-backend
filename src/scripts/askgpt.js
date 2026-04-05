import { program } from "commander";
import { askChatService } from "../services/applicationService.js"

const cvTemplate = `
Ibrahim Ayodeji Sanusi
Desarrollador Full Stack Junior
Madrid, España
✉  ibra.sanusi.ayo@gmail.com
github.com/ibraSanusi
linkedin.com/in/ibrahim-ayodeji-sanusi

PERFIL PROFESIONAL

Desarrollador Full Stack con casi 3 años de experiencia práctica acumulada entre formación, proyectos autodidactas y trabajo profesional. Acostumbrado a entregar producto real en entornos ágiles, desde MVPs hasta aplicaciones con IA integrada. Dominio nativo del inglés y español.

EXPERIENCIA PROFESIONAL

Desarrollador Full Stack Junior   ·   Fullcircle S.L.
Jun 2025 – Actualidad   •   Madrid, España
- Desarrollo de funcionalidades completas en proyectos MVP usando React, TypeScript, Node.js y Express.
- Integración técnica del sistema interno con plataforma de facturación electrónica (VeriFACTU), cumpliendo normativa fiscal española.
- Creación e integración de CRUDs RESTful, consumidos desde frontend y terceros.
- Implementación de tests unitarios y E2E, asegurando calidad en cada entrega.
- Extensión del backoffice: nuevos filtros, mejoras de UI y optimización de flujos de gestión.
- Desarrollo de scripts de automatización y cron jobs para tareas recurrentes del sistema.
- Uso de Docker para entornos de desarrollo y despliegue reproducibles.

Desarrollador Frontend (Prácticas)   ·   Recommiend App
3 meses  ·  Prácticas curriculares   •   Madrid, España
- Desarrollo completo del frontend de una app de análisis de fotografías con IA.
- Migración del backoffice interno de Redux a Next.js, mejorando rendimiento y mantenibilidad.
- Stack: React.js, Next.js, Tailwind CSS.
- Trabajo en equipo con metodologías ágiles (sprints, daily standups) y Git.

FORMACIÓN

CFGS Desarrollo de Aplicaciones Web (DAW)   ·   Madrid
CFGS Desarrollo de Aplicaciones Multiplataforma (DAM)   ·   Madrid
CFGM Sistemas Microinformáticos y Redes (SMR)   ·   Madrid

HABILIDADES TÉCNICAS

Frontend:       JavaScript, TypeScript, React.js, Next.js, Tailwind CSS
Backend:        Node.js, Express, REST APIs, Docker, Cron Jobs
Testing:        Jest/Vitest, Unit Testing, E2E Testing, Git
Integraciones:  VeriFACTU, WordPress, SEO Técnico, APIs externas

IDIOMAS

Español — Nativo
Inglés — Nativo

OTROS

GitHub activo: github.com/ibraSanusi
~3 años de experiencia práctica incluyendo formación y proyectos autodidactas.
`

async function askGpt() {
    program
        .option('-i, --input <string>')

    program.parse();

    const options = program.opts()
    const input = options.input
    // console.log(input)

    const application = await askChatService(input, cvTemplate)
    console.log(JSON.stringify(application, null, 2))
}

askGpt()