import { Req, Res } from '../types/util';
import pool from '../connection';

export const createCliente = async (req:Req, res:Res) => {
    const { nome, email, telefone } = req.body;

    if (nome && email && telefone) {
        pool.query('INSERT INTO cliente(nome, email, telefone) VALUES ($1::text, $2::text, $3::int) RETURNING *', [nome, email, telefone])
        .then(cliente => {
            return res.send(cliente.rows);
        }).catch(err => {           
            return res.status(500).send(err);
        })
    } else {
        return res.status(422).send("Faltou informar campos.");
    }
}

export const findClientes = async (req:Req, res:Res) => {
    pool.query('SELECT * FROM cliente')
    .then(clientes => {
        return res.send(clientes.rows);
    }).catch(err => {
        return res.status(500).send(err);
    })
}