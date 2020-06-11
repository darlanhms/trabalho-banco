import pool from './connection';

export const checkTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cliente (
                id SERIAL PRIMARY KEY NOT NULL, 
                nome VARCHAR(50) NOT NULL, 
                email VARCHAR(50), 
                telefone INT
            )
        `)
    } catch (exc) {
        console.log("Create table cliente exception: ", exc);
    }

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS endereco (
                cliente_id int NOT NULL,
                logradouro VARCHAR(30) NOT NULL,
                cidade VARCHAR(30) NOT NULL,
                estado VARCHAR(30) NOT NULL,
                bairro VARCHAR(30),
                numero INT,
                PRIMARY KEY (cliente_id),
                CONSTRAINT fk_cliente_id FOREIGN KEY (cliente_id) REFERENCES cliente (id)
            )
        `)
    } catch (exc) {
        console.log("Create table endereco exception: ", exc);
    }
}