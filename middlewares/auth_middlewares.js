// this is the protected route that means first user must be login to acess the routes in which this middleware will be setted 
// here first we will verify the token 

import User from "../models/user/user_models.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                success: false,
                message: "User must be logged in."
            });
        }

        const token = authorization.replace("Bearer ", "");

        const userDetails = jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "User must be logged in."
                });
            }

            const { _id } = payload;

            try {
                const userData = await User.findById(_id).select({ password: 0, __v: 0 })
                // console.log("this is user data ", userData);
                if (!userData) {
                    return res.status(401).json({
                        success: false,
                        message: "User must be logged in."
                    });
                }
                req.user = userData;
                next();
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error: Error retrieving user data"
                });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error: Error from auth middleware"
        });
    }
}

export default authMiddleware;
