import { Router } from 'express';
import clienteRoutes from './cliente.route';

const routes = Router();

routes.use("/cliente", clienteRoutes);

export default routes;

