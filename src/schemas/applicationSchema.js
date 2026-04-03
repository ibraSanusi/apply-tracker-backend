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