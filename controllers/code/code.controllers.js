import Code from "../../models/code_contribution/code_contribution_models.js";
import nodemailer from "nodemailer";


// logic for posting the code by a user
const postCode = async (req, res) => {
    try {
        const { title, code, category } = req.body;
        if (!title || !code || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Code image is required and should be under 1mb' });
        }


        // for not getting password of the user 
        // req.user.password = undefined;
        // console.log(req.user);
        // res.send("ok");
        const post = new Code({
            user: req.user._id,
            title,
            code,
            category,
            codeImage: req.file.location // URL of the uploaded code image in S3
        })

        const savedPost = await post.save();

        res.status(201).json({
            success: true,
            message: "User successfully post the code for review",
            savedPost
        })

        // Send a thank-you email to the user
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: req.user.email,
            subject: 'Thank you for sharing your code!',
            text: "You're one step closer to sharing your code with the world! We'll review it soon and get back to you.",
            html: `
              <p>Dear ${req.user.name},</p>
              <p>Thank you for sharing your code with us! We're excited to review it and get back to you soon.</p>
              <p>Best regards,</p>
              <p>Your Code Review Team</p>
            `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error from code controllers"
        });
    }
}

// now I want to fetch all the codes on the basis of category 
const getCodesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        const codes = await Code.find({ category, status: "approved" }).populate("user likes", "-password -email");

        // if user input the category which is not present then 
        if (codes.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Category you mentioned is not present in the list"
            });
        }

        res.status(200).json({
            success: true,
            codes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error from code controllers"
        });
    }
}


// Fetch accepted codes by user to show on their profiles
const getAcceptedCodesByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const acceptedCodes = await Code.find({ user: userId, status: "approved" })

        if (acceptedCodes.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Zero post is accepted by the admin,post some code for review."
            })
        }

        res.status(200).json({
            success: true,
            acceptedCodes
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error from code controllers"
        });
    }
}


// implementing the logic of like or unlike 
const likeFeature = async (req, res) => {
    try {
        // here we will be passing the id of the post from the frontend so that we can access it from req.body.user
        const { postId } = req.body;
        // Check if postId is provided
        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        // Update the code post with a new like from the user
        const updatedCode = await Code.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: req.user._id } }, // Use $addToSet to prevent duplicate likes
            { new: true }
        );

        if (!updatedCode) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            updatedCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error from code controllers"
        });
    }
}

const dislikeFeature = async (req, res) => {
    try {
        const { postId } = req.body;
        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        // removing the like 
        const updatedCode = await Code.findByIdAndUpdate(postId,
            { $pull: { likes: req.user._id } },
            { new: true },
        )

        if (!updatedCode) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post unliked successfully",
            updatedCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error from code controllers"
        });
    }
}

export { postCode, getCodesByCategory, getAcceptedCodesByUser, likeFeature, dislikeFeature };