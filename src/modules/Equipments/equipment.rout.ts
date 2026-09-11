import { Router } from "express";
import { createEquipment, deleteEquipment, getAllEquipments, updateEquipment } from "./equipment.controller";

const router = Router()

router.get("/", getAllEquipments)
router.post("/create", createEquipment)
router.put("/:id", updateEquipment)
router.delete("/:id", deleteEquipment)


export default router;