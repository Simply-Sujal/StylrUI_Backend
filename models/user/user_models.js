import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    profession: {
        type: String,
        required: [true, "Profession is required"]
    },
    location: {
        type: String,
        required: [true, "location is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Invalid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [8, "Minimum 8 characters required for password"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);

export default User;