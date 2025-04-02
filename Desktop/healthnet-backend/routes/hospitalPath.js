import express from "express";
import { createhospital, getAllhospital, getAllhospitalById, updatehospitalById, deletehospitalById, uploadMiddleware } from "../controllers/hospitalController.js";
const router = express.Router();

router.post("/createhospital", uploadMiddleware, createhospital);
router.get("/getAllhospital",uploadMiddleware, getAllhospital);
router.get("/getAllhospitalById/:id",uploadMiddleware, getAllhospitalById);
router.put("/updatehospitalById/:id",uploadMiddleware,  updatehospitalById);
router.delete("/deletehospitalById/:id",uploadMiddleware,  deletehospitalById);

export default router;