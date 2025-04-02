import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import Clinic from "../models/clinicModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Multer setup for file upload with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in an uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
export const uploadMiddleware = upload.single("clinicDocument");

// Upload file to Cloudinary
const uploadToCloudinary = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      { folder: "clinics", resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

// Create a new clinic
export const createClinic = async (req, res) => {
  try {
    const { name, email, password, designation, department, location, category, specialist, mobile, shortBio,  } = req.body;
    let uploadedDocumentUrl = "";

    if (!name || !location || !category ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (req.file) {
      try {
        uploadedDocumentUrl = await uploadToCloudinary(req.file.path);
      } catch (error) {
        return res.status(500).json({ message: "Error uploading document", error: error.message });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const newClinic = await Clinic.create({
      name,
      email,
      password: hashedPassword,
      designation,
      department,
      location,
      category,
      specialist,
      mobile,
      shortBio,
      
      clinicDocument: uploadedDocumentUrl,
    });

    const token = jwt.sign({ id: newClinic._id, name: newClinic.name }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1h" });
    res.status(201).json({ message: "Clinic created successfully", clinic: newClinic, token });
  } catch (error) {
    console.error("Error in createClinic:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};

// Get all clinics
export const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.status(200).json(clinics);
  } catch (error) {
    console.error("Error fetching clinics:", error);
    res.status(500).json({ message: "Error fetching clinics", error: error.toString() });
  }
};

// Get clinic by ID
export const getClinicById = async (req, res) => {
  const { id } = req.params;
  try {
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json(clinic);
  } catch (error) {
    console.error("Error fetching clinic:", error);
    res.status(500).json({ message: "Error fetching clinic", error: error.toString() });
  }
};

// Update clinic by ID
export const updateClinic = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, designation, department, location, category, specialist, mobile, address } = req.body;

  let updatedData = { name, email, designation, department, location, category, specialist, mobile, address };

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    if (req.file) {
      try {
        updatedData.clinicDocument = await uploadToCloudinary(req.file.path);
      } catch (error) {
        return res.status(500).json({ message: "Error uploading document", error: error.message });
      }
    }

    const updatedClinic = await Clinic.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedClinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json({ message: "Clinic updated successfully", clinic: updatedClinic });
  } catch (error) {
    console.error("Error updating clinic:", error);
    res.status(500).json({ message: "Error updating clinic", error: error.toString() });
  }
};

// Delete clinic by ID
export const deleteClinic = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedClinic = await Clinic.findByIdAndDelete(id);
    if (!deletedClinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    res.status(200).json({ message: "Clinic deleted successfully" });
  } catch (error) {
    console.error("Error deleting clinic:", error);
    res.status(500).json({ message: "Server error", error: error.toString() });
  }
};
