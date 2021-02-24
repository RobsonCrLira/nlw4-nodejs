import { Router } from 'express';
import { UserController } from './controllers/UserController';

const routes = Router();

const usersController = new UserController();

routes.post("/users", usersController.create);

export { routes };
