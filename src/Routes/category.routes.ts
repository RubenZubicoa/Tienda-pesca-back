import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  listCategoriesController,
  updateCategoryController,
} from "../Controllers/category.controller";

const router = Router();

router.get("/", listCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post("/", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;

