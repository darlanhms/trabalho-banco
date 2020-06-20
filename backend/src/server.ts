import express from 'express'
import bodyParser from 'body-parser'
import pgtools from 'pgtools'
import cors from 'cors'
import { checkTables } from './tables'
import routes from './routes'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  return res.send('API rodando')
})

app.use('/api', routes);

(async () => {
  try {
    await pgtools.createdb({
      user: 'postgres',
      password: process.env.DB_PWD,
      port: 5432,
      host: 'localhost'
    }, 'trabalho-transportadora')
  } catch (e) {
    if (e.message.indexOf('duplicate') === -1) {
      console.log('CREATE DATABASE EXCEPTION: ', e)
    }
  }

  // checamos se as tabelas necessárias já foram criadas
  checkTables()

  const PORT = 3000

  app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
  })
})()
