import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'trabalho-transportadora',
  password: process.env.DB_PWD,
  port: 5432
})

export default pool
