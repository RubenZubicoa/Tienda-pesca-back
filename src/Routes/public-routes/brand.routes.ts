import { Router } from "express";
import {
  getBrandByIdController,
  listBrandsController,
} from "../../Controllers/brand.controller";

const router = Router();

router.get("/", listBrandsController);
router.get("/:id", getBrandByIdController);

export default router;

