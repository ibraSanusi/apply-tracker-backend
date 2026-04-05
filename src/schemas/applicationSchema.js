export const saveApplicationSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string' },
        }
    },
    body: {
        type: 'object',
        required: ['company', 'position', "cv", "cover"],
        properties: {
            companyName: { type: 'string' },
            position: { type: 'string' },
            email: { type: 'string', format: 'email' },
            salary: { type: 'number' },
            medium: { type: 'string' },
            cv: { type: 'string' },
            cover: { type: 'string' },
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        company: { type: 'string' },
                        position: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        email: { type: 'string', format: 'email' },
                        salary: { type: 'number' },
                        medium: { type: 'string' },
                        cvUrl: { type: 'string', format: 'uri' },
                        coverUrl: { type: 'string', format: 'uri' },
                    }
                }
            }
        }
    }
}

export const askChatSchema = {
    body: {
        type: 'object',
        required: ['input', 'cvTemplate'],
        properties: {
            input: { type: 'string' },  // la oferta de trabajo
            cvTemplate: { type: 'string' },  // el CV base
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        company: { type: 'string' },
                        position: { type: 'string' },
                        email: { type: 'string', nullable: true },
                        salary: { type: 'number', nullable: true },
                        medium: { type: 'string', nullable: true },
                        cv: { type: 'string' },
                        cover: { type: 'string' },
                    }
                }
            }
        }
    }
}