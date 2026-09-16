import { Router } from "express";
import {
  createBrandController,
  deleteBrandController,
  updateBrandController,
} from "../../Controllers/brand.controller";
import { uploadBrandImage } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/", uploadBrandImage, createBrandController);
router.put("/:id", uploadBrandImage, updateBrandController);
router.delete("/:id", deleteBrandController);

export default router;

