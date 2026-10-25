import { Router } from "express";
import {
  createShippingCostController,
  deleteShippingCostController,
  getShippingCostByIdController,
  updateShippingCostController,
} from "../../Controllers/shippingCost.controller";

const router = Router();

router.get("/:id", getShippingCostByIdController);
router.post("/", createShippingCostController);
router.put("/:id", updateShippingCostController);
router.delete("/:id", deleteShippingCostController);

export default router;
