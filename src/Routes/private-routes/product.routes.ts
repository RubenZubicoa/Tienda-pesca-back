import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  updateProductController,
} from "../../Controllers/product.controller";
import multer from "../../libs/multer";

const router = Router();

router.post("/", multer.array('images'), createProductController);
router.put("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;

