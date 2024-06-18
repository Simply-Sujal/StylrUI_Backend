import express from "express";
import requireLogin from "../../middlewares/auth_middlewares.js"
import { postCode, getCodesByCategory, getAcceptedCodesByUser, likeFeature, dislikeFeature } from "../../controllers/code/code.controllers.js";
import uploadCodeImage from "../../utils/uploadCodeImage.js";

const router = express.Router();

// this is the route for submission of the code for review
router.post("/codesubmission", requireLogin, uploadCodeImage.single('codeImage'), postCode);

// this is the route for getting all codes by category
router.get("/category/:category", getCodesByCategory);

// this is the route for getting all codes info by the logged in user in their profile
router.get("/acceptedcodes", requireLogin, getAcceptedCodesByUser);

// this is for like and unlike routes 
router.put("/likecode", requireLogin, likeFeature);
router.put("/dislikecode", requireLogin, dislikeFeature);

export default router;