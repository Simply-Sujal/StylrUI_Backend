import express from "express";
import cors from "cors";
import startServer from "./connection.js";
import user from "./routes/user/user_routes.routes.js";
import code from "./routes/code/code_contributing.routes.js"
import block from "./routes/block/block_contributing.routes.js"
import admin from "./routes/admin/admin.routes.js";

const app = express();

// handling cors policy issue
const corsOptions = {
    origin: "http://localhost:5173",
    methods: 'GET,PUT,POST,DELETE,PATCH,HEAD',
    credentials: true
}
app.use(cors(corsOptions));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple route
app.get("/", (req, res) => {
    res.json({ success: true, message: "This is the home route" });
});

// all routes
app.use("/api/v1/user/", user)

// here user can submit their code for review 
app.use("/api/v1/code/", code)

// here user can submit their code for review 
app.use("/api/v1/block/", block)

// admin route 
app.use("/api/v1/admin", admin);

// this will run the server as well as db
startServer(app);
