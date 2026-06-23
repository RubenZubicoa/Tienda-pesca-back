import { Router } from "express";
import { createUserController, changePasswordController } from "../../Controllers/user.controller";

const router = Router();

router.post("/", createUserController);
router.post("/:id/change-password", changePasswordController);

export default router;  