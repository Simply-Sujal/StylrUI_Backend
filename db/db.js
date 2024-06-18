import mongoose from "mongoose";

const dbConnect = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit the process with failure code
    }
};

export default dbConnect;
