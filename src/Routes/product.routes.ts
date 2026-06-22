import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByBrandIdController,
  getProductByCategoryIdController,
  getProductByIdController,
  listProductsController,
  updateProductController,
} from "../Controllers/product.controller";
import multer from "../libs/multer";

const router = Router();

router.get("/", listProductsController);
router.get("/:id", getProductByIdController);
router.get("/brand/:brandId", getProductByBrandIdController);
router.get("/category/:categoryId", getProductByCategoryIdController);
router.post("/", multer.array('images'), createProductController);
router.put("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;

