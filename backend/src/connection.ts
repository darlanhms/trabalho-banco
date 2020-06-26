import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: process.env.DB_PWD,
  port: 5432,
  database: 'transportadora'
})

export default pool
