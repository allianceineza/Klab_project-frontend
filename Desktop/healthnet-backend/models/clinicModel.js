// import mongoose from "mongoose";
// const { model, Schema } = mongoose;

// const clinicSchema = new Schema(
//     {
//         name: {
//             type: String,
//             required: true
//         },
//         location: {
//             type: String,
//             required: true
//         },
//         category: {
//             type: String,
//             required: true
//         },
        
//         Designation: {
//             type: String,
//             required: true
//         },
//         Department: {
//             type: String,
//             required: true
//         },
//         Mobile: {
//             type: String,
//             required: true
//         },
//         Email: {
//             type: String,
//             required: true
//         },
//         Password: {
//             type: String,
//             required: true
//         },
        
//         specialist: {
//             type: String,
//             required: true
//         },
        
        
//         doctorImage: {
//             type: String,
//             default: " "
//         }
//     },
//     {
//         timestamps: true,
//         collection: "clinic" 
//     }
// );

// const clinic = model("clinic", clinicSchema);
// export default clinic;
import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  specialist: { type: String, required: true },
  mobile: { type: String, required: true },
  clinicDocument: { type: String, required: false },  // URL of the document uploaded to Cloudinary
});

const Clinic = mongoose.model("Clinic", clinicSchema);
export default Clinic;
