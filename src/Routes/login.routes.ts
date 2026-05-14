import { Router } from "express";
import { loginController } from "../Controllers/login.controller";

const router = Router();

router.post("/", loginController);

export default router;