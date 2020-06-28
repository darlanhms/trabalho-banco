import { Router } from 'express'
import { createCarga, findCarga, updateCarga, deleteCarga } from '@controllers/carga.controller'

const cargaRoutes = Router()

cargaRoutes.post('/', createCarga)
cargaRoutes.get('/', findCarga)
cargaRoutes.patch('/:id', updateCarga)
cargaRoutes.delete('/:id', deleteCarga)

export default cargaRoutes
