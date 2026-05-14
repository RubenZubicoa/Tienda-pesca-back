import { Router } from "express";
import { createUserController, listUsersController, getUserByIdController, updateUserController, deleteUserController, changePasswordController } from "../Controllers/user.controller";

const router = Router();

router.post("/", createUserController);
router.get("/", listUsersController);
router.get("/:id", getUserByIdController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);
router.post("/:id/change-password", changePasswordController);

export default router;  