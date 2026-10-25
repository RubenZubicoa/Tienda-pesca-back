import brandRoutes from "./brand.routes";
import categoryRoutes from "./category.routes";
import loginRoutes from "./login.routes";
import newsLetterRoutes from "./newsLetter.routes";
import productRoutes from "./product.routes";
import userRoutes from "./user.routes";
import Router from "express";

const router = Router();

router.use("/brands", brandRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/newsletters", newsLetterRoutes);
router.use("/login", loginRoutes);  

export default router;