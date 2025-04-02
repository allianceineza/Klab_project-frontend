import mongoose from "mongoose";
const { model, Schema } = mongoose;

const hospitalSchema = new Schema(
    {name: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    doctorImage: { type: String },
    Department: { type: String },
    Designation: { type: String },
    Mobile: { type: String },
    Email: { type: String },
    Password: { type: String, required: false },  // Make Password optional
    specialist: { type: String }
    
    },
    {
        timestamps: true,
        collection: "hospital" 
    }
);

const hospital = model("hospital", hospitalSchema);
export default hospital;
