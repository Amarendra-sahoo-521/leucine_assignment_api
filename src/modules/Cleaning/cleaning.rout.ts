import { Router } from "express";
import { createCleaning,  getAllCleaningByEqId, getAllCleaningById, updateCleaning,  } from "./cleaning.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router()

router.get("/:id",authMiddleware, getAllCleaningByEqId)
router.get("/get_record/:id",authMiddleware, getAllCleaningById)
router.post("/create",authMiddleware, createCleaning)
router.patch("/:id",authMiddleware, updateCleaning)


export default router;