import User from "../../models/user/user_models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to generate the token
const generateToken = (newUser) => {
    return jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "30d" });
};

// this is for checking whether the user is inputing the proper email or not
const properEmailFormatCheckerRegex = /\S+@\S+\.\S+/;

// this is boundary atleast this much length of password is accepted
const atleastPasswordSize = 8;

// register user logic 
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profession, location } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password || !location || !profession) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image is required and should be less than 1mb'
            });
        }

        if (!properEmailFormatCheckerRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        if (password.length < atleastPasswordSize) {
            return res.status(400).json({
                success: false,
                message: "Minimum 8 characters required for password"
            });
        }

        // Check if the email already exists
        const isEmailExist = await User.findOne({ email });

        if (isEmailExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists with that email"
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            profession,
            location,
            image: req.file.location // Assuming you save the file locally
        });

        // Generate token
        const token = generateToken(newUser);

        // Respond with success
        return res.status(201).json({
            success: true,
            message: "User successfully created",
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!properEmailFormatCheckerRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not exists with this email"
            });
        }

        const comparePasswordWithInputPassword = await bcrypt.compare(password, user.password);

        if (!comparePasswordWithInputPassword) {
            return res.status(404).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "User successfully login",
            token
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// getting user info who is login
const userDetails = async (req, res) => {
    try {
        const user = req.user;
        // console.log(user);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export { registerUser, loginUser, userDetails };