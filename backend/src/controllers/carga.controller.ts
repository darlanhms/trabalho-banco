import { Req, Res } from '../types/util'
import pool from '../connection'

export const createCarga = async (req:Req, res:Res) => {
  const { dataEntrada, dataEntrega, peso, largura, altura, comprimento, status, enderecoCarga, clienteId } = req.body
  const { logradouro, numero, bairro, cidade, estado } = enderecoCarga

  if (dataEntrada && dataEntrega && peso && largura && altura && comprimento && status && cidade && estado && logradouro) {
    pool.query('INSERT INTO carga(dataEntrada, dataEntrega, peso, largura, altura, comprimento, status, cliente_id) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::int) RETURNING *', [dataEntrada, dataEntrega, peso, largura, altura, comprimento, status, clienteId])
      .then(carga => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (carga.rows && carga.rows[0] && carga.rows[0].id) {
          pool.query(
            'INSERT INTO enderecoCarga (carga_id, cidade, estado, logradouro, bairro, numero) VALUES ($1, $2::text, $3::text, $4::text, $5::text, $6::int) RETURNING *',
            [carga.rows[0].id, cidade, estado, logradouro, bairro, numero]
          ).then(enderecoCarga => {
            // vaidacao pra checar se recebemos alguma resposta do banco
            if (enderecoCarga && enderecoCarga.rows[0]) {
              carga.rows[0].enderecoCarga = enderecoCarga.rows[0]
              return res.send(carga.rows[0])
            } else {
              return res.status(500).send('Endereço da carga retornou null')
            }
          }).catch(err => {
            console.log(err)

            return res.status(500).send(err)
          })
        } else {
          return res.status(500).send('Carga retornou null')
        }
      }).catch(err => {
        console.log(err)
        return res.status(500).send(err)
      })
  } else {
    return res.status(422).send('Faltou informar campos.')
  }
}

export const findCarga = async (req:Req, res:Res) => {
  pool.query(`
SELECT * 
FROM carga c, enderecoCarga e 
WHERE c.id = e.carga_id 
`)
    .then(carga => {
      return res.send(carga.rows)
    }).catch(err => {
      return res.status(500).send(err)
    })
}

export const updateCarga = async (req:Req, res:Res) => {
  const { id } = req.params
  const { dataEntrada, dataEntrega, peso, largura, altura, comprimento, status, enderecoCarga } = req.body
  const { logradouro, numero, bairro, cidade, estado } = enderecoCarga

  if (dataEntrada && dataEntrega && peso && largura && altura && comprimento && status && cidade && estado && logradouro) {
    pool.query('UPDATE cliente SET (dataEntrada, dataEntrega, peso, largura, altura, comprimento, status) = ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text) WHERE id = $7::int RETURNING *', [dataEntrada, dataEntrega, peso, largura, altura, comprimento, status, parseInt(id)])
      .then(carga => {
        // vaidacao pra checar se recebemos alguma resposta do banco
        if (carga.rows && carga.rows[0] && carga.rows[0].id) {
          pool.query(
            'UPDATE enderecoCarga SET (cidade, estado, logradouro, bairro, numero) = ($2::text, $3::text, $4::text, $5::text, $6::int) WHERE carga_id = $1 RETURNING *',
            [id, cidade, estado, logradouro, bairro, numero]
          ).then(enderecoCarga => {
            // vaidacao pra checar se recebemos alguma resposta do banco
            if (enderecoCarga && enderecoCarga.rows[0]) {
              carga.rows[0].enderecoCarga = enderecoCarga.rows[0]
              return res.send(carga.rows[0])
            } else {
              return res.status(500).send('Endereço da carga retornou null')
            }
          }).catch(err => {
            return res.status(500).send(err)
          })
        } else {
          return res.status(500).send('Carga retornou null')
        }
      }).catch(err => {
        return res.status(500).send(err)
      })
  } else {
    return res.status(422).send('Faltou informar campos.')
  }
}
