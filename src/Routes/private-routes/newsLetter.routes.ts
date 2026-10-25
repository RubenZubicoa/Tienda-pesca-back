import { Router } from "express";
import {
  createNewsLetterController,
  deleteNewsLetterController,
  publishNewsLetterController,
  updateNewsLetterController,
} from "../../Controllers/newsLetter.controller";
import { uploadNewsLetterFiles } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/", uploadNewsLetterFiles, createNewsLetterController);
router.post("/:id/publish", publishNewsLetterController);
router.put("/:id", uploadNewsLetterFiles, updateNewsLetterController);
router.delete("/:id", deleteNewsLetterController);

export default router;
