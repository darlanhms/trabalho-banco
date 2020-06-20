import pool from './connection';

export const checkTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cliente (
                id SERIAL PRIMARY KEY NOT NULL, 
                nome VARCHAR(50) NOT NULL, 
                email VARCHAR(50), 
                telefone VARCHAR(14)
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

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS endereco_carga (
                id SERIAL PRIMARY KEY NOT NULL,
                logradouro VARCHAR(50),
                numero INT,
                bairro VARCHAR(50),
                cidade VARCHAR(50),
                estado VARCHAR(2),
                PRIMARY KEY(id)
            )
        `)
    } catch (exc) {
        console.log("Create table endereco exception: ", exc);
    }

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS carga (
                id SERIAL PRIMARY KEY NOT NULL,
                id_endereco_carga INT NOT NULL,
                id_cliente INT NOT NULL,
                data_entrada VARCHAR(8),
                data_entrega VARCHAR(8),
                peso VARCHAR(50),
                largura VARCHAR(50),
                altura VARCHAR(50),
                comprimento VARCHAR(50),
                status VARCHAR(1),
                PRIMARY KEY(id),
                CONSTRAINT fk_endereco_carga FOREIGN KEY (id_endereco_carga) REFERENCES endereco_carga (id),
                CONSTRAINT fk_cliente_carga FOREIGN KEY (id_cliente) REFERENCES cliente (id)
            )
        `)
    } catch (exc) {
        console.log("Create table endereco exception: ", exc);
    }
}