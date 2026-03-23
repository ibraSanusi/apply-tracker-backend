import pg from 'pg'
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])

export default db