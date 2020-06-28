import { Router } from 'express'
import { createCliente, findClientes, updateCliente, deleteCliente } from '@controllers/cliente.controller'

const clienteRoutes = Router()

clienteRoutes.post('/', createCliente)
clienteRoutes.get('/', findClientes)
clienteRoutes.patch('/:id', updateCliente)
clienteRoutes.delete('/:id', deleteCliente)

export default clienteRoutes
