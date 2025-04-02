import express from "express";
import { createPharmacy, getAllPharmacy, getPharmacyById, updatePharmacyById, deletePharmacyById, uploadMiddleware } from "../controllers/pharmacyController.js";


const router = express.Router();

router.post("/createpharmacy", uploadMiddleware,  createPharmacy);
router.get("/getAllpharmacy",uploadMiddleware, getAllPharmacy);
router.get("/getAllpharmacyById/:id",uploadMiddleware, getPharmacyById);
router.put("/updatepharmacyById/:id",uploadMiddleware,  updatePharmacyById);
router.delete("/deletepharmacyById/:id",uploadMiddleware, deletePharmacyById);

export default router;