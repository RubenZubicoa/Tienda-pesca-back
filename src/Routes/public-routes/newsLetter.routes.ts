import { Router } from "express";
import {
  getNewsLetterByIdController,
  getNewsLetterDocumentController,
  listNewsLettersController,
} from "../../Controllers/newsLetter.controller";

const router = Router();

router.get("/", listNewsLettersController);
router.get("/:id/document", getNewsLetterDocumentController);
router.get("/:id", getNewsLetterByIdController);

export default router;
