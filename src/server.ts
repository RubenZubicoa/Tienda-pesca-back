import express, { type Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

const server: Application = express();

import brandRoutes from "./Routes/brand.routes";
import categoryRoutes from "./Routes/category.routes";
import productRoutes from "./Routes/product.routes";
import { errorMiddleware } from './middlewares/error.middeware';
import loginRoutes from './Routes/login.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import orderRoutes from './Routes/order.routes';
import userRoutes from './Routes/user.routes';

// Middlewares

server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/uploads", express.static("uploads"));

server.use("/login", loginRoutes);
server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/products", productRoutes);

server.use(authMiddleware);

server.use("/orders", orderRoutes);
server.use("/users", userRoutes);

server.use(errorMiddleware);


export default server;