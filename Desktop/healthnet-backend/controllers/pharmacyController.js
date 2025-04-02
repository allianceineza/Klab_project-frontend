import multer from "multer"; 
import cloudinary from "../utils/cloudinary.js";
import Pharmacy from "../models/pharmacyModel.js"; // ✅ Fix the import
import { Readable } from "stream";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const createPharmacy = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        const { name, location, category } = req.body;
        let uploadedImageUrl = "";

        if (!name || !location || !category) {
            return res.status(400).json({ message: "Missing required fields: name, location, category" });
        }

        console.log("Required fields validated");

        if (req.file) {
            try {
                console.log("Uploading file to Cloudinary");

                const stream = Readable.from(req.file.buffer);

                const cloudinaryUpload = new Promise((resolve, reject) => {
                    const cloudinaryStream = cloudinary.uploader.upload_stream(
                        { folder: "pharmacies" },
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
                return res.status(500).json({ message: "Error uploading image", error: cloudinaryError.toString() });
            }
        }

        try {
            console.log("Creating pharmacy in database");
            const newPharmacy = await Pharmacy.create({ // ✅ Fixed reference
                name,
                location,
                category,
                image: uploadedImageUrl,
            });
            console.log("Pharmacy created:", newPharmacy);
            res.status(201).json(newPharmacy);
        } catch (dbError) {
            console.error("Database error:", dbError);
            res.status(500).json({ message: "Error creating pharmacy", error: dbError.toString() });
        }
    } catch (error) {
        console.error("Error in createPharmacy controller:", error);
        res.status(500).json({ message: "Server error", error: error.toString() });
    }
};

export const getAllPharmacy = async (req, res) => { // ✅ Fixed function name
    try {
        console.log("Fetching all pharmacies from database...");
        const pharmacies = await Pharmacy.find({});  // ✅ Fixed reference
        res.status(200).json(pharmacies);
    } catch (error) {
        console.error("Error fetching pharmacies:", error);
        res.status(500).json({ message: "Error fetching pharmacies", error: error.toString() });
    }
};

export const getPharmacyById = async (req, res) => { // ✅ Fixed function name
    try {
        const { id } = req.params;
        console.log(`Fetching pharmacy with ID: ${id}`);

        const pharmacy = await Pharmacy.findById(id); // ✅ Fixed reference

        if (!pharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        res.status(200).json(pharmacy);
    } catch (error) {
        console.error("Error fetching pharmacy by ID:", error);
        res.status(500).json({ message: "Error fetching pharmacy", error: error.toString() });
    }
};

export const updatePharmacyById = async (req, res) => { // ✅ Fixed function name
    try {
        const { id } = req.params;
        console.log(`Updating pharmacy with ID: ${id}`);

        const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, req.body, { new: true }); // ✅ Fixed reference

        if (!updatedPharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        res.status(200).json(updatedPharmacy);
    } catch (error) {
        console.error("Error updating pharmacy by ID:", error);
        res.status(500).json({ message: "Error updating pharmacy", error: error.toString() });
    }
};

export const deletePharmacyById = async (req, res) => { // ✅ Fixed function name
    try {
        const { id } = req.params;
        console.log(`Deleting pharmacy with ID: ${id}`);

        const deletedPharmacy = await Pharmacy.findByIdAndDelete(id); // ✅ Fixed reference

        if (!deletedPharmacy) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }

        res.status(200).json(deletedPharmacy);
    } catch (error) {
        console.error("Error deleting pharmacy:", error);
        res.status(500).json({ message: "Error deleting pharmacy", error: error.toString() });
    }
};

export const uploadMiddleware = upload.single("image");
