import { Router } from "express";
import {  createUser, getAllUsers, loginUser, logoutUserController, refreshTokenController} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router()

router.get("/get_users", authMiddleware, getAllUsers)
router.post("/create", authMiddleware, createUser)
router.post("/login", loginUser)
router.post("/logout", logoutUserController)
router.post("/refresh", refreshTokenController);


export default router;