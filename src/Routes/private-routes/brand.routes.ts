import { Router } from "express";
import {
  createBrandController,
  deleteBrandController,
  updateBrandController,
} from "../../Controllers/brand.controller";

const router = Router();

router.post("/", createBrandController);
router.put("/:id", updateBrandController);
router.delete("/:id", deleteBrandController);

export default router;

