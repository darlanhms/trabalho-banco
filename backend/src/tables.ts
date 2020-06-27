import pool from './connection'
import pgtools from 'pgtools'
import dotenv from 'dotenv'

dotenv.config()

export const checkTables = async () => {
  try {
    await pgtools.createdb({
      user: 'postgres',
      password: process.env.DB_PWD,
      port: 5432,
      host: 'localhost'
    }, 'transportadora')
  } catch (e) {
    if (e.message.indexOf('duplicate') === -1) {
      console.log('CREATE DATABASE EXCEPTION: ', e)
    }
  }

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
                logradouro VARCHAR(50),
                numero VARCHAR(11),
                bairro VARCHAR(50),
                cidade VARCHAR(50),
                estado VARCHAR(2),
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
                clienteId INT NOT NULL,
                dataEntrada VARCHAR(8),
                dataEntrega VARCHAR(8),
                peso VARCHAR(20),
                largura VARCHAR(20),
                altura VARCHAR(20),
                comprimento VARCHAR(20),
                status INT,
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
                numero VARCHAR(11),
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
