import User from "../../models/user/user_models.js";
import Code from "../../models/code_contribution/code_contribution_models.js";
import nodemailer from "nodemailer";


// this function will response all the user who are registered to our platform
const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password -isAdmin -email")
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Users not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Users are present",
            users
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "user not found from the getalluser function for admin"
        })
    }
}

// getting single user by id
const getSingleUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id }).select("-password -email -isAdmin -__v");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const userCode = await Code.find({ user: id }).select("-codeImage -__v")

        res.status(200).json({
            success: true,
            message: "User found",
            user,
            userCode
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "user not found from the getsingleuser function for admin"
        })
    }
}

// updating the user 
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = req.body;

        const updatedUserData = await User.updateOne({ _id: id }, {
            $set: updatedUser
        })

        res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            updatedUserData
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            success: false,
            message: "user not found from the Updateuser function for admin"
        })
    }
}

// this is the route which allows admin to control or change the status of user code
const updateCodeStatus = async (req, res) => {
    try {
        const codeId = req.params.codeId;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        // Find and update the code
        const code = await Code.findByIdAndUpdate(
            codeId,
            { status },
            { new: true }
        );

        // if (!code) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Code not found"
        //     });
        // }

        // Send an email if the code is approved
        if (status === 'approved') {
            const user = await User.findById(code.user);

            if (user) {
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
                    to: user.email,
                    subject: 'Congratulations! Your code has been approved',
                    text: 'Congratulations! Your code has been approved by our admin.',
                    html: '<p>Congratulations! Your code has been approved by our admin.</p>'
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }

        res.status(200).json({
            success: true,
            message: "Code status updated",
            code
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error updating code status"
        });
    }
};


// delete user by id
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            status: true,
            message: "User deleted successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error deleting user."
        });
    }
}


export { getAllUser, getSingleUser, updateUser, updateCodeStatus, deleteUser };