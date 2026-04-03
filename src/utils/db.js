export async function insert({ model, data, returning = '*' }, db) {
    const columns = Object.keys(data)
    const query = `
        INSERT INTO "${model}" (${columns.map(c => { return `"${c}"` })})
        VALUES (${columns.map((_, idx) => { return `$${idx + 1}` }).join(', ')})
        RETURNING ${returning}
    `

    const values = Object.values(data)
    const result = await db.query(query, values)
    return result.rows[0]
}