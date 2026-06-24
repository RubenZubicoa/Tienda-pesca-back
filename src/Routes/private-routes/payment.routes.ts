import { Router } from "express";
import { createPaymentController } from "../../Controllers/payment.controller";

const router = Router();

router.post("/create-payment-intent", createPaymentController);

export default router;