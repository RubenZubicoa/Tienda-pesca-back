import { Router } from "express";
import { createUserController, listUsersController, getUserByIdController, updateUserController, deleteUserController, changePasswordController } from "../../Controllers/user.controller";

const router = Router();

router.get("/", listUsersController);
router.get("/:id", getUserByIdController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;  