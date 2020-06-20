import { Router } from 'express';
import { createCarga, findCarga, updateCarga } from '../controllers/carga.controller';

const cargaRoutes = Router();

cargaRoutes.post("/", createCarga);
cargaRoutes.get("/", findCarga);
cargaRoutes.patch("/:id", updateCarga);

export default cargaRoutes;