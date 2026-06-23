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
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/uploads", express.static("uploads"));

// public routes

server.use("/", publicRoutes);

// private routes

server.use(authMiddleware);

server.use("/", privateRoutes);

server.use(errorMiddleware);


export default server;