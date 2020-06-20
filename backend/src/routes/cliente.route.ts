import { Router } from 'express'
import { createCliente, findClientes, updateCliente } from '../controllers/cliente.controller'

const clienteRoutes = Router()

clienteRoutes.post('/', createCliente)
clienteRoutes.get('/', findClientes)
clienteRoutes.patch('/:id', updateCliente)

export default clienteRoutes
