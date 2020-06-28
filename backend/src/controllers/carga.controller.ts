import { Req, Res } from '../types/util'
import pool from '../connection'

export const createCarga = async (req:Req, res:Res) => {
  const { dataentrada, dataentrega, peso, largura, altura, comprimento, status, endereco, clienteid } = req.body
  const { logradouro, numero, bairro, cidade, estado } = endereco

  if (clienteid) {
    pool.query('INSERT INTO carga(dataEntrada, dataEntrega, peso, largura, altura, comprimento, status, clienteId) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::int, $8::int) RETURNING *',
      [dataentrada, dataentrega, peso, largura, altura, comprimento, parseInt(status), parseInt(clienteid)])
      .then(carga => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (carga.rows && carga.rows[0] && carga.rows[0].id) {
          pool.query(
            'INSERT INTO enderecoCarga (cargaId, cidade, estado, logradouro, bairro, numero) VALUES ($1, $2::text, $3::text, $4::text, $5::text, $6::int) RETURNING *',
            [carga.rows[0].id, cidade, estado, logradouro, bairro, numero]
          ).then(enderecoCarga => {
            pool.query('SELECT * FROM cliente WHERE id = $1', [parseInt(clienteid)])
              .then(cliente => {
              // vaidacao pra checar se recebemos alguma resposta do banco
                if (enderecoCarga && enderecoCarga.rows[0]) {
                  carga.rows[0].endereco = enderecoCarga.rows[0]
                } else {
                  return res.status(500).send('Endereço da carga retornou null')
                }

                if (cliente.rows && cliente.rows[0]) {
                  carga.rows[0].cliente = cliente.rows[0]
                }

                return res.send(carga.rows[0])
              }).catch(err => {
                console.log('Erro find cliente', err)
                return res.status(500).send(err)
              })
          }).catch(err => {
            console.log('Erro insert endereco', err)
            return res.status(500).send(err)
          })
        } else {
          return res.status(500).send('Carga retornou null')
        }
      }).catch(err => {
        console.log('Erro insert carga', err)
        return res.status(500).send(err)
      })
  } else {
    return res.status(422).send('Faltou informar campos.')
  }
}

export const findCarga = async (req:Req, res:Res) => {
  pool.query(`
    SELECT cg.*, en.*, cli.nome, cli.email, cli.telefone 
    FROM carga cg 
    INNER JOIN cliente cli ON cg.clienteid = cli.id 
    INNER JOIN enderecoCarga en ON en.cargaid = cg.id
  `).then(carga => {
    return res.send(treatRows(carga))
  }).catch(err => {
    console.log('Erro find carga: ', err)
    return res.status(500).send(err)
  })
}

export const updateCarga = async (req:Req, res:Res) => {
  const { id } = req.params
  const { dataentrada, dataentrega, peso, largura, altura, comprimento, status, endereco, clienteid } = req.body
  const { logradouro, numero, bairro, cidade, estado } = endereco

  if (clienteid) {
    pool.query('UPDATE carga SET (dataentrada, dataentrega, peso, largura, altura, comprimento, status, clienteId) = ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::int, $8::int) WHERE id = $9::int RETURNING *',
      [dataentrada, dataentrega, peso, largura, altura, comprimento, status, parseInt(clienteid), parseInt(id)])
      .then(carga => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (carga.rows && carga.rows[0] && carga.rows[0].id) {
          pool.query(
            'UPDATE enderecoCarga SET (cidade, estado, logradouro, bairro, numero) = ($2::text, $3::text, $4::text, $5::text, $6::int) WHERE cargaId = $1 RETURNING *',
            [parseInt(id), cidade, estado, logradouro, bairro, numero]
          ).then(enderecoCarga => {
            pool.query('SELECT * FROM cliente WHERE id = $1', [parseInt(clienteid)])
              .then(cliente => {
              // vaidacao pra checar se recebemos alguma resposta do banco
                if (enderecoCarga && enderecoCarga.rows[0]) {
                  carga.rows[0].endereco = enderecoCarga.rows[0]
                } else {
                  return res.status(500).send('Endereço da carga retornou null')
                }

                if (cliente.rows && cliente.rows[0]) {
                  carga.rows[0].cliente = cliente.rows[0]
                }

                return res.send(carga.rows[0])
              }).catch(err => {
                console.log('Erro find cliente', err)
                return res.status(500).send(err)
              })
          }).catch(err => {
            console.log('Erro update endereco: ', err)
            return res.status(500).send(err)
          })
        } else {
          return res.status(500).send('Carga retornou null')
        }
      }).catch(err => {
        console.log('Erro update carga: ', err)
        return res.status(500).send(err)
      })
  } else {
    return res.status(422).send('Faltou informar campos.')
  }
}

export const deleteCarga = async (req:Req, res:Res) => {
  const { id } = req.params

  pool.query('DELETE FROM enderecoCarga WHERE cargaId = $1', [parseInt(id)])
    .then(deleted => {
      pool.query('DELETE FROM carga WHERE id = $1', [parseInt(id)])
        .then(deleted => {
          return res.send('ok')
        }).catch(err => {
          console.log('Erro ao deletar carga: ', err)
          return res.status(500).send(err)
        })
    }).catch(err => {
      console.log('Erro ao deletar endereço: ', err)
      return res.status(500).send(err)
    })
}

function treatRows (carga: any) {
  if (carga.rows && Array.isArray(carga.rows) && carga.rows.length) {
    return carga.rows.map((carga:any) => {
      if (!carga.endereco) {
        carga.endereco = {
          logradouro: carga.logradouro,
          cidade: carga.cidade,
          estado: carga.estado,
          bairro: carga.bairro,
          numero: carga.numero
        }
      }

      if (!carga.cliente) {
        carga.cliente = {
          nome: carga.nome,
          email: carga.email,
          telefone: carga.telefone
        }
      }

      delete carga.cidade
      delete carga.estado
      delete carga.bairro
      delete carga.numero
      delete carga.logradouro
      delete carga.nome
      delete carga.email
      delete carga.telefone
      delete carga.cargaid

      return carga
    })
  }
}
