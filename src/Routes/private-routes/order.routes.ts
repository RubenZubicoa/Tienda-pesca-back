import { Router } from "express";
import { createOrderController, deleteOrderController, getOrderByIdController, listOrdersController, updateOrderController } from "../../Controllers/order.controller";

const router = Router();

router.post("/", createOrderController);
router.get("/", listOrdersController);
router.get("/:id", getOrderByIdController);
router.put("/:id", updateOrderController);
router.delete("/:id", deleteOrderController);

export default router;  