import mongoose from "mongoose";
const { model, Schema } = mongoose;

const pharmacySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        
        image: {
            type: String,
            default: " "
        }
    },
    {
        timestamps: true,
        collection: "pharmacy" 
    }
);

const pharmacy = model("pharmacy", pharmacySchema);
export default pharmacy;
