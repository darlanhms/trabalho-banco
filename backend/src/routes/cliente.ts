import { Router } from 'express';
import { createCliente, findClientes } from '../controllers/cliente';

const clienteRoutes = Router();

clienteRoutes.post("/", createCliente);
clienteRoutes.get("/", findClientes);

export default clienteRoutes;

