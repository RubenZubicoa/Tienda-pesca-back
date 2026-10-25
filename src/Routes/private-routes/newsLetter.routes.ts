import { Router } from "express";
import {
  createNewsLetterController,
  deleteNewsLetterController,
  updateNewsLetterController,
} from "../../Controllers/newsLetter.controller";
import { uploadNewsLetterFiles } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/", uploadNewsLetterFiles, createNewsLetterController);
router.put("/:id", uploadNewsLetterFiles, updateNewsLetterController);
router.delete("/:id", deleteNewsLetterController);

export default router;
