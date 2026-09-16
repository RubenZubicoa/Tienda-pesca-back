import { Router } from "express";
import {
  createCategoryController,
  createSubcategoryController,
  deleteCategoryController,
  updateCategoryController,
  updateSubcategoryController,
} from "../../Controllers/category.controller";
import { uploadCategoryImage } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/", uploadCategoryImage, createCategoryController);
router.post("/:categoryId/subcategories", uploadCategoryImage, createSubcategoryController);
router.put("/:categoryId/subcategories/:subcategoryId", uploadCategoryImage, updateSubcategoryController);
router.put("/:id", uploadCategoryImage, updateCategoryController);
router.patch("/:id", uploadCategoryImage, updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;

