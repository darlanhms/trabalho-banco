import { Router } from 'express';
import clienteRoutes from './cliente';

const routes = Router();

routes.use("/cliente", clienteRoutes);

export default routes;

