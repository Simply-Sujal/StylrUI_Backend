import dotenv from "dotenv";
import dbConnect from "./db/db.js";
dotenv.config();


// Connect to the database and start the server
const startServer = async (app) => {
    try {
        await dbConnect(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Exit the process with failure code
    }
};

export default startServer;