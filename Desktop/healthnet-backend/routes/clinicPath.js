// import express from "express";
// import { 
//   createClinic, 
//   getAllClinics, 
//   getClinicById, 
//   updateClinicById, 
//   deleteClinicById, 
//   uploadMiddleware 
// } from "../controllers/clinicController.js";

// const router = express.Router();


// router.post("/createclinic", uploadMiddleware, createClinic);
// router.get("/getallclinics", getAllClinics);
// router.get("/getclinic/:id", getClinicById);
// router.put("/updateclinic/:id", updateClinicById);
// router.delete("/deleteclinic/:id", deleteClinicById);

// export default router;
// import express from "express";
// import { createClinic, getAllClinics, getClinicById, updateClinic, deleteClinic, uploadMiddleware } from "../controllers/clinicController.js";

// const router = express.Router();

// router.post("/createclinic", uploadMiddleware, createClinic);
// router.get("/getAllClinics", getAllClinics); 
// router.get("/clinics/:id", getClinicById);
// router.put("/clinics/:id", updateClinic);
// router.delete("/clinics/:id", deleteClinic);

// export default router;
import express from "express";
import { 
  createClinic, 
  getAllClinics, 
  getClinicById, 
  updateClinic, 
  deleteClinic, 
  uploadMiddleware 
} from "../controllers/clinicController.js";

const router = express.Router();

// Use existing uploadMiddleware from the controller
router.post("/createclinic", uploadMiddleware, createClinic);

// Ensure the route matches the frontend request
router.get("/getAllClinics", getAllClinics); 

router.get("/clinics/:id", getClinicById);
router.put("/clinics/:id", updateClinic);
router.delete("/clinics/:id", deleteClinic);

export default router;
