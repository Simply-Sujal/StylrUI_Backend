import Block from "../../models/block_contribution/block_contribution_models.js"
import nodemailer from "nodemailer";


// logic for posting the code by a user
const postBlockCode = async (req, res) => {
    try {
        const { title, code, category } = req.body;
        if (!title || !code || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Block image is required and should be in under 1mb' });
        }


        // for not getting password of the user 
        // req.user.password = undefined;
        // console.log(req.user);
        // res.send("ok");
        const post = new Block({
            user: req.user._id,
            title,
            code,
            category,
            blockImage: req.file.location // URL of the uploaded code image in S3
        })

        const savedPost = await post.save();

        res.status(201).json({
            success: true,
            message: "User successfully post the block code for review",
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
const getBlockCodesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        const blockCodes = await Block.find({ category, status: "approved" }).populate("user likes", "-password -email");

        // if user input the category which is not present then 
        if (blockCodes.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Category you mentioned is not present in the list"
            });
        }

        res.status(200).json({
            success: true,
            blockCodes
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
const getAcceptedBlockCodesByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const acceptedBlockCodes = await Block.find({ user: userId, status: "approved" })

        if (acceptedBlockCodes.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Zero post is accepted by the admin,post some code for review."
            })
        }

        res.status(200).json({
            success: true,
            acceptedBlockCodes
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
        const { postId } = req.body;
        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        const updatedBlockCode = await Block.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: req.user._id } },
            { new: true }
        );

        if (!updatedBlockCode) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            updatedBlockCode
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

        const updatedBlockCode = await Block.findByIdAndUpdate(
            postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        );

        if (!updatedBlockCode) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post unliked successfully",
            updatedBlockCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error from code controllers"
        });
    }
}

export { postBlockCode, getBlockCodesByCategory, getAcceptedBlockCodesByUser, likeFeature, dislikeFeature };