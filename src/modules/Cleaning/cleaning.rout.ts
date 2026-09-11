import { Router } from "express";
import { createCleaning,  getAllCleaningByEqId, getAllCleaningById, updateCleaning,  } from "./cleaning.controller";

const router = Router()

router.get("/:id", getAllCleaningByEqId)
router.get("/get_record/:id", getAllCleaningById)
router.post("/create", createCleaning)
router.patch("/:id", updateCleaning)


export default router;