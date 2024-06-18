import express from "express";
import adminMiddleware from "../../middlewares/admin_middlewares.js";
import authMiddleware from "../../middlewares/auth_middlewares.js";
import { getAllUser, getSingleUser, updateUser, updateCodeStatus, deleteUser } from "../../controllers/admin/admin.controllers.js";

const router = express.Router();

// getting all users
router.route("/users").get(authMiddleware, adminMiddleware, getAllUser);

// getting single user
router.route("/users/:id").get(authMiddleware, adminMiddleware, getSingleUser);

// updating single user
router.route("/users/update/:id").get(authMiddleware, adminMiddleware, updateUser);

// updating code status 
router.route("/users/:codeId/status").put(authMiddleware, adminMiddleware, updateCodeStatus);

// deleting the user by id
router.route("/users/delete/:id").delete(authMiddleware, adminMiddleware, deleteUser);

export default router;