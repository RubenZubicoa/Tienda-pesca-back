import { Router } from "express";
import {
  deleteNewsLetterSubscriptionController,
  getNewsLetterSubscriptionByIdController,
  listNewsLetterSubscriptionsController,
  updateNewsLetterSubscriptionController,
} from "../../Controllers/newsLetterSubscription.controller";

const router = Router();

router.get("/", listNewsLetterSubscriptionsController);
router.get("/:id", getNewsLetterSubscriptionByIdController);
router.put("/:id", updateNewsLetterSubscriptionController);
router.delete("/:id", deleteNewsLetterSubscriptionController);

export default router;
