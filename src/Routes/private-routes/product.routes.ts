import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  updateProductController,
} from "../../Controllers/product.controller";
import { uploadProductImages } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/", uploadProductImages, createProductController);
router.put("/:id", uploadProductImages, updateProductController);
router.delete("/:id", deleteProductController);

export default router;

