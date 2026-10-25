import { Router } from "express";
import {
  getNewsLetterByIdController,
  listNewsLettersController,
} from "../../Controllers/newsLetter.controller";

const router = Router();

router.get("/", listNewsLettersController);
router.get("/:id", getNewsLetterByIdController);

export default router;
