import { Router } from 'express';
import {
  getSessionHandler,
  deleteSessionHandler,
} from '../controllers/session.controller.js';

const sessionRoutes = Router();

sessionRoutes.get('/', getSessionHandler);
sessionRoutes.delete('/:id', deleteSessionHandler);

export default sessionRoutes;
