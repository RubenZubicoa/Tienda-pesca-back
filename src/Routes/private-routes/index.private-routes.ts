import Router from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import brandRoutes from "./brand.routes";
import categoryRoutes from "./category.routes";
import newsLetterRoutes from "./newsLetter.routes";
import newsLetterSubscriptionRoutes from "./newsLetterSubscription.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";
import userRoutes from "./user.routes";
import paymentRoutes from "./payment.routes";

const router = Router();

router.use(authMiddleware);

router.use("/brands", brandRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/payments", paymentRoutes);
router.use("/newsletters", newsLetterRoutes);
router.use("/newsletter-subscriptions", newsLetterSubscriptionRoutes);

export default router;