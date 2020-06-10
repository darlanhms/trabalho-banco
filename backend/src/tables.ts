import pool from './connection';

export const checkTables = async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS cliente (
        id SERIAL PRIMARY KEY NOT NULL, 
        nome TEXT, 
        email TEXT, 
        telefone INT
    )`)
}