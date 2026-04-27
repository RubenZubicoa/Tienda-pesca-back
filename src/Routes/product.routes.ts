import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByBrandIdController,
  getProductByIdController,
  listProductsController,
  updateProductController,
} from "../Controllers/product.controller";

const router = Router();

router.get("/", listProductsController);
router.get("/:id", getProductByIdController);
router.get("/brand/:brandId", getProductByBrandIdController);
router.post("/", createProductController);
router.put("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;

