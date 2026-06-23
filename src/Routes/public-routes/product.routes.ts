import { Router } from "express";
import {
  getProductByBrandIdController,
  getProductByCategoryIdController,
  getProductByIdController,
  listProductsController,
} from "../../Controllers/product.controller";

const router = Router();

router.get("/", listProductsController);
router.get("/:id", getProductByIdController);
router.get("/brand/:brandId", getProductByBrandIdController);
router.get("/category/:categoryId", getProductByCategoryIdController);

export default router;

