import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
} from "../../Controllers/category.controller";

const router = Router();

router.post("/", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;

