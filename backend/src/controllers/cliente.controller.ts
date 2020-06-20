import { Req, Res } from '../types/util'
import pool from '../connection'

export const createCliente = async (req:Req, res:Res) => {
  const { nome, email, telefone, endereco } = req.body
  const { logradouro, numero, bairro, cidade, estado } = endereco

  if (nome && email && telefone && cidade && estado && logradouro) {
    pool.query('INSERT INTO cliente(nome, email, telefone) VALUES ($1::text, $2::text, $3::text) RETURNING *', [nome, email, telefone])
      .then(cliente => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (cliente.rows && cliente.rows[0] && cliente.rows[0].id) {
          pool.query(
            'INSERT INTO endereco(cliente_id, cidade, estado, logradouro, bairro, numero) VALUES ($1, $2::text, $3::text, $4::text, $5::text, $6::int) RETURNING *',
            [cliente.rows[0].id, cidade, estado, logradouro, bairro, numero]
          ).then(endereco => {
            // vaidacao pra checar se recebemos alguma resposta do banco
            if (endereco && endereco.rows[0]) {
              cliente.rows[0].endereco = endereco.rows[0]
              return res.send(cliente.rows[0])
            } else {
              return res.status(500).send('Endereço retornou null')
            }
          }).catch(err => {
            return res.status(500).send(err)
          })
        } else {
          return res.status(500).send('Cliente retornou null')
        }
      }).catch(err => {
        return res.status(500).send(err)
      })
  } else {
    return res.status(422).send('Faltou informar campos.')
  }
}

export const findClientes = async (req:Req, res:Res) => {
  pool.query(`
        SELECT * 
            FROM cliente c, endereco e 
            WHERE c.id = e.cliente_id 
    `)
    .then(clientes => {
      return res.send(clientes.rows)
    }).catch(err => {
      return res.status(500).send(err)
    })
}

export const updateCliente = async (req:Req, res: Res) => {
  const { id } = req.params
  const { nome, email, telefone, endereco } = req.body
  const { logradouro, numero, bairro, cidade, estado } = endereco

  if (id && nome && email && telefone && cidade && estado && logradouro) {
    pool.query('UPDATE cliente SET (nome, email, telefone) = ($1::text, $2::text, $3::text) WHERE id = $4::int RETURNING *', [nome, email, telefone, parseInt(id)])
      .then(cliente => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (cliente.rows && cliente.rows[0] && cliente.rows[0].id) {
          pool.query(
            'UPDATE endereco SET (cidade, estado, logradouro, bairro, numero) = ($2::text, $3::text, $4::text, $5::text, $6::int) WHERE cliente_id = $1 RETURNING *',
            [id, cidade, estado, logradouro, bairro, numero]
          ).then(endereco => {
            // vaidacao pra checar se recebemos alguma resposta do banco
            if (endereco && endereco.rows[0]) {
              cliente.rows[0].endereco = endereco.rows[0]
              return res.send(cliente.rows[0])
            } else {
              return res.status(500).send('Endereço retornou null')
            }
          }).catch(err => {
            return res.status(500).send(err)
          })
        } else {
          return res.status(500).send('Cliente retornou null')
        }
      }).catch(err => {
        return res.status(500).send(err)
      })
  } else {
    return res.status(422).send('Faltou informar campos.')
  }
}
