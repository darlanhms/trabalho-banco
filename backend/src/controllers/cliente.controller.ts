import { Req, Res } from '../types/util'
import pool from '../connection'

export const createCliente = async (req:Req, res:Res) => {
  const { nome, email, telefone, endereco } = req.body
  const { logradouro, numero, bairro, cidade, estado } = endereco

  if (nome) {
    pool.query('INSERT INTO cliente(nome, email, telefone) VALUES ($1::text, $2::text, $3::text) RETURNING *', [nome, email, telefone])
      .then(cliente => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (cliente.rows && cliente.rows[0] && cliente.rows[0].id) {
          pool.query(
            'INSERT INTO enderecoCliente(clienteId, cidade, estado, logradouro, bairro, numero) VALUES ($1, $2::text, $3::text, $4::text, $5::text, $6::int) RETURNING *',
            [cliente.rows[0].id, cidade, estado, logradouro, bairro, numero]
          ).then(enderecoCliente => {
            // vaidacao pra checar se recebemos alguma resposta do banco
            if (enderecoCliente && enderecoCliente.rows[0]) {
              cliente.rows[0].endereco = enderecoCliente.rows[0]
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
        FROM cliente c
        INNER JOIN enderecoCliente en ON en.clienteId = c.id
    `)
    .then(clientes => {
      return res.send(treatRows(clientes))
    }).catch(err => {
      return res.status(500).send(err)
    })
}

export const updateCliente = async (req:Req, res: Res) => {
  const { id } = req.params
  const { nome, email, telefone, endereco } = req.body
  const { logradouro, numero, bairro, cidade, estado } = endereco

  if (id && nome) {
    pool.query('UPDATE cliente SET (nome, email, telefone) = ($1::text, $2::text, $3::text) WHERE id = $4::int RETURNING *', [nome, email, telefone, parseInt(id)])
      .then(cliente => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (cliente.rows && cliente.rows[0] && cliente.rows[0].id) {
          pool.query(
            'UPDATE enderecoCliente SET (cidade, estado, logradouro, bairro, numero) = ($2::text, $3::text, $4::text, $5::text, $6::int) WHERE clienteId = $1 RETURNING *',
            [parseInt(id), cidade, estado, logradouro, bairro, numero]
          ).then(enderecoCliente => {
            // vaidacao pra checar se recebemos alguma resposta do banco
            if (enderecoCliente && enderecoCliente.rows[0]) {
              cliente.rows[0].endereco = enderecoCliente.rows[0]
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

export const deleteCliente = async (req:Req, res: Res) => {
  const { id } = req.params
  if (id) {
    pool.query('DELETE FROM enderecoCliente WHERE clienteId = $1::int', [parseInt(id)])
      .then(deleted => {
        pool.query('DELETE FROM cliente WHERE id = $1::int', [parseInt(id)])
          .then(deleted => {
            return res.send('ok')
          }).catch(err => {
            return res.status(500).send(err)
          })
      }).catch(err => {
        return res.status(500).send(err)
      })
  } else {
    return res.status(422).send('ID não informado')
  }
}

function treatRows (cliente: any) {
  if (cliente.rows && Array.isArray(cliente.rows) && cliente.rows.length) {
    return cliente.rows.map((cliente:any) => {
      if (!cliente.endereco) {
        cliente.endereco = {
          logradouro: cliente.logradouro,
          cidade: cliente.cidade,
          estado: cliente.estado,
          bairro: cliente.bairro,
          numero: cliente.numero
        }
      }

      delete cliente.cidade
      delete cliente.estado
      delete cliente.bairro
      delete cliente.numero
      delete cliente.logradouro

      return cliente
    })
  }
}
