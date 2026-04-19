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
            company: { type: 'string' },
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

export const getApplicationByIdSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string' },
        }
    },
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        company: { type: 'string' },
                        position: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        email: { type: 'string', format: 'email', nullable: true },
                        salary: { type: 'number', nullable: true },
                        medium: { type: 'string', nullable: true },
                        cvUrl: { type: 'string', format: 'uri' },
                        coverUrl: { type: 'string', format: 'uri' },
                    }
                }
            }
        }
    }
}

export const updateApplicationSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string' },
        }
    },
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' }
        }
    },
    body: {
        type: 'object',
        properties: {
            company: { type: 'string' },
            position: { type: 'string' },
            email: { type: 'string', format: 'email' },
            salary: { type: 'number' },
            medium: { type: 'string' },
            cv: { type: 'string' },
            cover: { type: 'string' },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        company: { type: 'string' },
                        position: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        email: { type: 'string', format: 'email', nullable: true },
                        salary: { type: 'number', nullable: true },
                        medium: { type: 'string', nullable: true },
                        cvUrl: { type: 'string', format: 'uri' },
                        coverUrl: { type: 'string', format: 'uri' },
                    }
                },
                message: { type: 'string' }
            }
        }
    }
}

export const deleteApplicationSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string' },
        }
    },
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}

export const askChatSchema = {
    body: {
        type: 'object',
        required: ['jobDescription', 'cvTemplate'],
        properties: {
            jobDescription: { type: 'string' },  // la oferta de trabajo
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
                        cv: { type: 'object', additionalProperties: true },
                        cover: { type: 'string' },
                    }
                }
            }
        }
    }
}

export const getApplicationsSchema = {
    headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
            authorization: { type: 'string' },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            company: { type: 'string' },
                            position: { type: 'string' },
                            createdAt: { type: 'string', format: 'date-time' },
                            email: { type: 'string', format: 'email' },
                            salary: { type: 'number' },
                            medium: { type: 'string' },
                        }
                    }
                }
            }
        }
    }
}