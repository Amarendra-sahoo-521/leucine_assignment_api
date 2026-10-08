import { Router } from "express";
import { createEquipment, deleteEquipment, getAllEquipments, updateEquipment } from "./equipment.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";

const router = Router()

router.get("/",authMiddleware, getAllEquipments)
router.post("/create",authMiddleware, createEquipment)
router.put("/:id",authMiddleware, updateEquipment)
router.delete("/:id",authMiddleware, deleteEquipment)


export default router;