import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import Hospital from "../models/hospitalModel.js";
import { Readable } from "stream";

// Multer Storage (for handling file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file upload
export const uploadMiddleware = upload.single("doctorImage");

export const createhospital = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        const { 
            name, 
            location, 
            category, 
            Department, 
            Designation, 
            Mobile, 
            Email, 
            Password, 
            specialist 
        } = req.body;
        
        let uploadedImageUrl = "";
        
        // Validate required fields
        if (!name || !location || !category) {
            return res.status(400).json({ message: "Missing required fields: name, location, category" });
        }
        
        console.log("Required fields validated");
        
        // Handle file upload if a file is provided
        if (req.file) {
            try {
                console.log("Uploading file to Cloudinary...");
                
                const stream = Readable.from(req.file.buffer);
                
                const cloudinaryUpload = new Promise((resolve, reject) => {
                    const cloudinaryStream = cloudinary.uploader.upload_stream(
                        { folder: "hospitals" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    
                    stream.pipe(cloudinaryStream);
                });
                
                const cloudinaryResponse = await cloudinaryUpload;
                console.log("Cloudinary response:", cloudinaryResponse);
                uploadedImageUrl = cloudinaryResponse.secure_url;
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(500).json({ 
                    message: "Error uploading image", 
                    error: cloudinaryError.message || "Unknown cloudinary error"
                });
            }
        }
        
        // Create the hospital record
        try {
            console.log("Creating hospital in database...");
            
            // If password handling is needed, you should hash it here
            // const hashedPassword = await bcrypt.hash(Password, 10);
            
            const newHospital = await Hospital.create({
                name,
                location,
                category,
                doctorImage: uploadedImageUrl,
                Department: Department || "",
                Designation: Designation || "",
                Mobile: Mobile || "",
                Email: Email || "",
                Password: Password || "", // You should hash this before saving
                specialist: specialist || ""
            });
            
            console.log("Hospital created:", newHospital);
            res.status(201).json(newHospital);
        } catch (dbError) {
            console.error("Database error:", dbError);
            res.status(500).json({ 
                message: "Error creating hospital", 
                error: dbError.message || "Unknown database error" 
            });
        }
    } catch (error) {
        console.error("Error in createhospital controller:", error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message || "Unknown error" 
        });
    }
};

export const getAllhospital = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching hospitals", 
            error: error.message || "Unknown error" 
        });
    }
};

export const getAllhospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching hospital", 
            error: error.message || "Unknown error" 
        });
    }
};

export const updatehospitalById = async (req, res) => {
    try {
        const updatedHospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedHospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        res.status(200).json(updatedHospital);
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating hospital", 
            error: error.message || "Unknown error" 
        });
    }
};

export const deletehospitalById = async (req, res) => {
    try {
        const deletedHospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!deletedHospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        res.status(200).json({ message: "Hospital deleted successfully" });
    } catch (error) {
        res.status(500).json({ 
            message: "Error deleting hospital", 
            error: error.message || "Unknown error" 
        });
    }
};