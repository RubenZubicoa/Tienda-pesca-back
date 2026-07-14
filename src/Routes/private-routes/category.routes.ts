import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
  updateSubcategoryController,
} from "../../Controllers/category.controller";

const router = Router();

router.post("/", createCategoryController);
router.put("/:categoryId/subcategories/:subcategoryId", updateSubcategoryController);
router.put("/:id", updateCategoryController);
router.patch("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;

