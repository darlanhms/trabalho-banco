import { Router } from 'express'
import clienteRoutes from './cliente.route'
import cargaRoutes from './carga.route'

const routes = Router()

routes.use('/cliente', clienteRoutes)
routes.use('/carga', cargaRoutes)

export default routes
