import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    userRole: { type: String, enum: ["Admin", "User", "Owner"], required: true },
    tokens: {
        accessToken: { type: String }
    }
});

export default mongoose.model("User", userSchema);
