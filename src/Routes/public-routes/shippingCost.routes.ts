import { Router } from "express";
import { listShippingCostsController } from "../../Controllers/shippingCost.controller";

const router = Router();

router.get("/", listShippingCostsController);

export default router;
