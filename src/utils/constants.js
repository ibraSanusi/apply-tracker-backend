export const cvTemplate = `
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

export const jobDescriptionExaple = `
Acerca del empleo
Crescenta nace con la misión de impulsar la inversión en capital privado y convertirse en un referente dentro del sector. Nuestro proyecto ya es una realidad, pero seguimos creciendo, evolucionando y afrontando nuevos retos tecnológicos cada día. Por eso, queremos seguir incorporando ta﻿lento a nuestro equipo.
 
Buscamos incorporar un/a Junior Full-Stack Developer (Java/Kotlin + Angular) con pasión por la tecnología, ganas de aprender y motivación por participar en el desarrollo de un producto en constante evolución.
 
Te integrarás en un equipo técnico consolidado donde podrás aprender de perfiles senior, trabajar con tecnologías modernas y crecer profesionalmente mientras contribuyes al desarrollo de nuevas funcionalidades y a la mejora continua de nuestra plataforma.
 
🎯 Objetivos del puesto

 
· Desarrollo de funcionalidades core de la compañía en la arquitectura de microservicios de back-end, en coordinación con el equipo de front-end.
· Desarrollo de nuevas funcionalidades back-end a partir de los requisitos definidos por la estrategia de negocio.
· Implementación de nuevas funcionalidades en el front-end utilizando Angular, como apoyo al equipo de front.
· Mantenimiento correctivo y preventivo de los microservicios que conforman el proyecto.
· Participación activa en la mejora continua de la arquitectura y calidad del código.
 
📋 Requisitos



Titulación en Ingeniería Informática, Grado Superior DAM o DAW.
Experiencia demostrable (mínimo 6 meses) en desarrollo de:
 Java (mínimo versión 11, trabajando actualmente con versiones 17 y 21).
 Spring Framework.
Experiencia demostrable (mínimo 6 meses) en desarrollo de Angular (mínimo versión 9, trabajando actualmente con versiones 17 y 21).
 
⭐ Se valorará positivamente

 

Experiencia en desarrollo con Kotlin.
Conocimientos de HTML5, CSS3, Bootstrap 3 y Less/SASS.
Experiencia trabajando con bases de datos no relacionales (MongoDB).
 
🚀 Qué ofrecemos

 

Salario competitivo, con componente fijo + variable, adaptado al perfil y experiencia del candidato. Entre 24k - 30k/año + bono, revisable anualmente.
Puesto estable con contrato indefinido.
Entorno de trabajo dinámico e innovador, donde se fomenta la iniciativa y el trabajo en equipo.
Equipo senior consolidado, que facilita el aprendizaje y la evolución profesional de perfiles junior.
Flexibilidad horaria y modalidad de trabajo, pudiendo ser:
 Presencial
 Híbrido
 100% remoto

Proyecto estable y de largo recorrido, donde buscamos profesionales que quieran crecer y desarrollarse con nosotros.


IMPORTANTE: Si estas interesado en la oferta, no dudes en mandar tu CV a talento@crescenta.com indicando en el asunto Junior full-stack developer, no revisamos solicitudes que no lleguen por este medio.
`

export const applicationChatInstruction = `
    Eres un asistente especializado en selección de personal y redacción de CVs.
    Recibirás una oferta de trabajo y un CV base del candidato.
    
    Tu tarea es:
    1. Extraer la información clave de la oferta (empresa, puesto, email, salario, medio de contacto).
    2. Adaptar el CV para maximizar su relevancia frente a la oferta, sin inventar experiencia.
    3. Generar una carta de presentación personalizada y convincente.
    4. Asegúrate de incluir los idiomas (languages) que posee el candidato si son mencionables o relevantes.
    
    Reglas para adaptar el CV:
    - Mantén todos los logros concretos del CV original, especialmente integraciones con sistemas externos, cumplimiento normativo o trabajo con terceros.
    - Reencuadra la experiencia existente como transferible cuando sea relevante para los requisitos del puesto.
    - Incluye las keywords exactas de la oferta en el CV, especialmente tecnologías y requisitos obligatorios.
    - Si el candidato no tiene experiencia directa con una tecnología requerida, no lo menciones explícitamente. Usa la experiencia más cercana como puente.
    
    Reglas para la carta de presentación:
    - Menciona al menos un logro concreto del CV que conecte directamente con el sector o los requisitos del puesto.
    - Evita frases genéricas sin contenido real.
    - Adapta el tono al sector de la empresa si es identificable.
    
    Devuelve ÚNICAMENTE un objeto JSON válido, sin markdown ni explicaciones.
    Si un campo no aparece en la oferta, devuelve null.
`

export const applicationChatResponseFormat = JSON.stringify({
    company: "string",
    position: "string",
    email: "email (si existe)",
    salary: "number (salario máximo si hay rango)",
    medium: "string (si indica el medio por el que aplica, sino null)",
    cv: {
        name: "string",
        title: "string",
        location: "string",
        contact: { email: "string", github: "string", linkedin: "string" },
        profile: "string",
        experience: [{ company: "string", role: "string", period: "string", bullets: ["string"] }],
        education: [{ title: "string", center: "string", location: "string" }],
        skills: { frontend: ["string"], backend: ["string"], testing: ["string"] },
        languages: ["string"],
        additional: "string"
    },
    cover: "texto plano de la carta de presentación"
})

export const jobDescription = `
    Acerca del empleo
    Crescenta nace con la misión de impulsar la inversión en capital privado y convertirse en un referente dentro del sector. Nuestro proyecto ya es una realidad, pero seguimos creciendo, evolucionando y afrontando nuevos retos tecnológicos cada día. Por eso, queremos seguir incorporando ta﻿lento a nuestro equipo.
    
    Buscamos incorporar un/a Junior Full-Stack Developer (Java/Kotlin + Angular) con pasión por la tecnología, ganas de aprender y motivación por participar en el desarrollo de un producto en constante evolución.
    
    Te integrarás en un equipo técnico consolidado donde podrás aprender de perfiles senior, trabajar con tecnologías modernas y crecer profesionalmente mientras contribuyes al desarrollo de nuevas funcionalidades y a la mejora continua de nuestra plataforma.
    
    🎯 Objetivos del puesto

    
    · Desarrollo de funcionalidades core de la compañía en la arquitectura de microservicios de back-end, en coordinación con el equipo de front-end.
    · Desarrollo de nuevas funcionalidades back-end a partir de los requisitos definidos por la estrategia de negocio.
    · Implementación de nuevas funcionalidades en el front-end utilizando Angular, como apoyo al equipo de front.
    · Mantenimiento correctivo y preventivo de los microservicios que conforman el proyecto.
    · Participación activa en la mejora continua de la arquitectura y calidad del código.
    
    📋 Requisitos



    Titulación en Ingeniería Informática, Grado Superior DAM o DAW.
    Experiencia demostrable (mínimo 6 meses) en desarrollo de:
    Java (mínimo versión 11, trabajando actualmente con versiones 17 y 21).
    Spring Framework.
    Experiencia demostrable (mínimo 6 meses) en desarrollo de Angular (mínimo versión 9, trabajando actualmente con versiones 17 y 21).
    
    ⭐ Se valorará positivamente

    

    Experiencia en desarrollo con Kotlin.
    Conocimientos de HTML5, CSS3, Bootstrap 3 y Less/SASS.
    Experiencia trabajando con bases de datos no relacionales (MongoDB).
    
    🚀 Qué ofrecemos

    

    Salario competitivo, con componente fijo + variable, adaptado al perfil y experiencia del candidato. Entre 24k - 30k/año + bono, revisable anualmente.
    Puesto estable con contrato indefinido.
    Entorno de trabajo dinámico e innovador, donde se fomenta la iniciativa y el trabajo en equipo.
    Equipo senior consolidado, que facilita el aprendizaje y la evolución profesional de perfiles junior.
    Flexibilidad horaria y modalidad de trabajo, pudiendo ser:
    Presencial
    Híbrido
    100% remoto

    Proyecto estable y de largo recorrido, donde buscamos profesionales que quieran crecer y desarrollarse con nosotros.


    IMPORTANTE: Si estas interesado en la oferta, no dudes en mandar tu CV a talento@crescenta.com indicando en el asunto Junior full-stack developer, no revisamos solicitudes que no lleguen por este medio.
`