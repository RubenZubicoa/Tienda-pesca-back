import { Router } from "express";
import {
  getCategoryByIdController,
  listCategoriesController,
} from "../../Controllers/category.controller";

const router = Router();

router.get("/", listCategoriesController);
router.get("/:id", getCategoryByIdController);

export default router;

