import pool from './connection'

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
    console.log('Create table cliente exception: ', exc)
  }

  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS enderecoCliente (
                clienteId int NOT NULL,
                logradouro VARCHAR(30) NOT NULL,
                cidade VARCHAR(30) NOT NULL,
                estado VARCHAR(30) NOT NULL,
                bairro VARCHAR(30),
                numero INT,
                PRIMARY KEY (clienteId),
                CONSTRAINT fk_cliente_id FOREIGN KEY (clienteId) REFERENCES cliente (id)
            )
        `)
  } catch (exc) {
    console.log('Create table endereco_cliente exception: ', exc)
  }

  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS carga (
                id SERIAL PRIMARY KEY NOT NULL,
                clienteId int NOT NULL,
                dataEntrada VARCHAR(8),
                dataEntrega VARCHAR(8),
                peso VARCHAR(50),
                largura VARCHAR(50),
                altura VARCHAR(50),
                comprimento VARCHAR(50),
                status VARCHAR(1),
                CONSTRAINT fk_cliente_id FOREIGN KEY (clienteId) REFERENCES cliente (id)
            )
        `)
  } catch (exc) {
    console.log('Create table carga exception: ', exc)
  }

  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS enderecoCarga (
                cargaId int NOT NULL,
                logradouro VARCHAR(50),
                numero INT,
                bairro VARCHAR(50),
                cidade VARCHAR(50),
                estado VARCHAR(2),
                PRIMARY KEY (cargaId),
                CONSTRAINT fk_carga_id FOREIGN KEY (cargaId) REFERENCES carga (id)
            )
        `)
  } catch (exc) {
    console.log('Create table endereco_carga exception: ', exc)
  }
}
