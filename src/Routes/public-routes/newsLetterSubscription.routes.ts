import { Router } from "express";
import { createNewsLetterSubscriptionController } from "../../Controllers/newsLetterSubscription.controller";

const router = Router();

router.post("/", createNewsLetterSubscriptionController);

export default router;
