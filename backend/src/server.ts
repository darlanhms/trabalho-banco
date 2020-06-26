import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { checkTables } from './tables'
import routes from './routes'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  return res.send('API rodando')
})

app.use('/api', routes);

(async () => {
  // checamos se as tabelas necessárias já foram criadas
  checkTables()

  const PORT = 3000

  app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
  })
})()
