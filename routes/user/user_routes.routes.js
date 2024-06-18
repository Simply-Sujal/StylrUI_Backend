import express from "express";
import { loginUser, registerUser, userDetails } from "../../controllers/user/user_controllers.js";
import authMiddleware from "../../middlewares/auth_middlewares.js";
import upload from "../../utils/uploadConfig.js";

const router = express.Router();

// this is the register user route
router.post("/register", upload.single('image'), registerUser)

// this is the login user route
router.post("/login", loginUser)

// this is the userinfo routes 
router.get("/userinfo", authMiddleware, userDetails);

// protected route
router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "This is from the protected route"
    })
})

export default router;