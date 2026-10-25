import { NextFunction, Request, Response } from "express";
import { AddOrder, isAddOrder, UpdateOrder } from "../entities/Order";
import { createOrder, deleteOrder, getOrderById, listOrders, updateOrder } from "../Models/order.model";

function parseShippingCost(value: unknown): number | undefined | null {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) return null;
    return parsed;
}

export async function createOrderController(req: Request, res: Response, next: NextFunction) {
    try {
        const order: AddOrder = req.body;
        if (!isAddOrder(order)) {
            return res.status(400).json({ message: "El campo 'order' es obligatorio y debe ser un objeto válido" });
        }

        const shippingCost = parseShippingCost(order.shippingCost);
        if (shippingCost === null) {
            return res.status(400).json({
                message: "El campo 'shippingCost' debe ser un número mayor o igual a 0",
            });
        }

        const created = await createOrder({
            ...order,
            ...(shippingCost !== undefined ? { shippingCost } : {}),
        });
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

        const order: UpdateOrder = { ...req.body };
        if (Object.prototype.hasOwnProperty.call(req.body ?? {}, "shippingCost")) {
            const shippingCost = parseShippingCost(order.shippingCost);
            if (shippingCost === null) {
                return res.status(400).json({
                    message: "El campo 'shippingCost' debe ser un número mayor o igual a 0",
                });
            }
            if (shippingCost === undefined) {
                delete order.shippingCost;
            } else {
                order.shippingCost = shippingCost;
            }
        }

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