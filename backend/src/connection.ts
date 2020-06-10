import { Pool } from 'pg';
const config = require("../config.json");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'trabalho-transportadora',
    password: config.password,
    port: 5432,
});

export default pool;