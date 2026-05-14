import { NextFunction, Request, Response } from "express";
import { AddOrder } from "../entities/Order";
import { createOrder, deleteOrder, getOrderById, listOrders, updateOrder } from "../Models/order.model";

export async function createOrderController(req: Request, res: Response, next: NextFunction) {
    try {
        const order = req.body;
        if (!order) {
            return res.status(400).json({ message: "El campo 'order' es obligatorio" });
        }
        const created = await createOrder(order);
        return res.status(201).json(created);
    } catch (err) {
        next(err as Error);
    }
}

export async function listOrdersController(req: Request, res: Response, next: NextFunction) {
    try {
        const orders = await listOrders();
        return res.status(200).json(orders);
    } catch (err) {
        next(err as Error);
    }
}

export async function getOrderByIdController(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params; 
        if (!id || typeof id !== "string") {
            return res.status(400).json({ message: "El campo 'id' es obligatorio" });
        }
        const order = await getOrderById(id as string);
        if (!order) {
            return res.status(404).json({ message: "Order no encontrado" });
        }
        return res.status(200).json(order);
    } catch (err) {
        next(err as Error);
    }
}

export async function updateOrderController(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ message: "El campo 'id' es obligatorio" });
        }
        const order = req.body;
        const updated = await updateOrder(id as string, order);
        if (!updated) {
            return res.status(404).json({ message: "Order no encontrado" });
        }
        return res.status(200).json(updated);
    } catch (err) {
        next(err as Error);
    }
}

export async function deleteOrderController(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ message: "El campo 'id' es obligatorio" });
        }
        const deleted = await deleteOrder(id as string);
        if (!deleted) {
            return res.status(404).json({ message: "Order no encontrado" });
        }
        return res.status(204).send();
    } catch (err) {
        next(err as Error);
    }
}