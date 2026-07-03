import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controlles/UserController.js';
import SessionController from './app/controlles/SessionController.js';
import ProductController from './app/controlles/ProductController.js';
import CategoryController from './app/controlles/CategoryController.js';
import OrderController from './app/controlles/OrderController.js';



import multerConfig from './config/multer.cjs';
import authMiddleware from './app/middlewares/auth.js';
import adminMiddleware from './app/middlewares/admin.js';

import createPaymentIntentController from './app/controlles/stripe/CreatePaymentIntentController.js';

const routes = new Router();
const upload = multer(multerConfig);

// públicas
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/products', ProductController.index);
routes.get('/categories', CategoryController.index);

// proteção global
routes.use(authMiddleware);

// produtos
routes.post('/products', adminMiddleware, upload.single('file'), ProductController.store);
routes.put('/products/:id', adminMiddleware, upload.single('file'), ProductController.update);
routes.delete("/products/:id", adminMiddleware, ProductController.delete);
routes.put('/products/:id/restore', ProductController.restore);

// categorias
routes.post('/categories', adminMiddleware, upload.single('file'), CategoryController.store);
routes.put('/categories/:id', adminMiddleware, upload.single('file'), CategoryController.update);

// pedidos
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', adminMiddleware, OrderController.update);

routes.post('/create-payment-intent', createPaymentIntentController.store);

export default routes;