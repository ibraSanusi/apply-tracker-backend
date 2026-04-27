import prisma from "../prismaClient.js"

export async function insertApplication(application, db) {
    // return await insert({ data: application, model: 'JobApplication' }, db)
    return await prisma.jobApplication.create({ data: application })
}

export async function deleteApplication(id, db) {
    const result = await prisma.jobApplication.deleteMany({
        where: { id: parseInt(id) }
    })
    return result.count
}



export async function findApplicationById(id) {
    return await prisma.jobApplication.findUnique({
        where: { id: parseInt(id) }
    })
}


export async function getApplications(userId, db) {
    return await prisma.jobApplication.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' }
    })
}


export async function updateApplication(id, data) {
    return await prisma.jobApplication.update({
        where: { id: parseInt(id) },
        data
    })
}


export async function findApplicationsToFollowUp(date, db) {
    const query = `
        SELECT ja.*, u.email as "userEmail", u.name as "userName"
        FROM "JobApplication" ja
        JOIN "User" u ON ja."userId" = u.id
        WHERE ja."createdAt"::date = $1::date
        AND ja.status = 'applied'
        AND ja.email IS NOT NULL
    `
    const result = await db.query(query, [date])
    return result.rows
}