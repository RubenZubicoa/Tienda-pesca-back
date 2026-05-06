import express, { type Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

const server: Application = express();

import brandRoutes from "./Routes/brand.routes";
import categoryRoutes from "./Routes/category.routes";
import productRoutes from "./Routes/product.routes";
import { errorMiddleware } from './middlewares/error.middeware';

// Middlewares

server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/products", productRoutes);

server.use(errorMiddleware);


export default server;