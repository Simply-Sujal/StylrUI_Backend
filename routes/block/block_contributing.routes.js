import express from "express";
import { postBlockCode, getBlockCodesByCategory, getAcceptedBlockCodesByUser, likeFeature, dislikeFeature } from "../../controllers/block/block.controllers.js";
import uploadBlockImage from "../../utils/uploadBlockImage.js";
import requireLogin from "../../middlewares/auth_middlewares.js"


const router = express.Router();

// this is the route for submission of the block code for review
router.post("/blockcodesubmission", requireLogin, uploadBlockImage.single('blockImage'), postBlockCode);

// this is the route for getting all block codes by category only if it is approved 
router.get("/category/:category", getBlockCodesByCategory);

// this is the route for getting all block codes info by the logged in user in their profile
router.get("/acceptedcodes", requireLogin, getAcceptedBlockCodesByUser);

// this is for like and unlike routes 
router.put("/likecode", requireLogin, likeFeature);
router.put("/dislikecode", requireLogin, dislikeFeature);


export default router;