import express, { type Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';


import { errorMiddleware } from './middlewares/error.middeware';
import { authMiddleware } from './middlewares/auth.middleware';
import publicRoutes from './Routes/public-routes/index.public-routes';
import privateRoutes from './Routes/private-routes/index.private-routes';

const server: Application = express();

// Middlewares

server.use(morgan('dev'));
server.use(cors());

// No parsear multipart aquí: multer necesita el stream intacto
server.use((req, res, next) => {
  if (req.is('multipart/form-data')) return next();
  express.json({ limit: '10mb' })(req, res, next);
});
server.use((req, res, next) => {
  if (req.is('multipart/form-data')) return next();
  express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

server.use("/uploads", express.static("uploads"));

// public routes

server.use("/", publicRoutes);

// private routes

// server.use(authMiddleware);

server.use("/", privateRoutes);

server.use(errorMiddleware);


export default server;