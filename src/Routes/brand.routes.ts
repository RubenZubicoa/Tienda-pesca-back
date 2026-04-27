import { Router } from "express";
import {
  createBrandController,
  deleteBrandController,
  getBrandByIdController,
  listBrandsController,
  updateBrandController,
} from "../Controllers/brand.controller";

const router = Router();

router.get("/", listBrandsController);
router.get("/:id", getBrandByIdController);
router.post("/", createBrandController);
router.put("/:id", updateBrandController);
router.delete("/:id", deleteBrandController);

export default router;

