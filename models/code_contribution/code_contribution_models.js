import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    codeImage: {
        type: String,
        required: [true, "Demo Image is required"]
    },
    category: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }

},
    {
        timestamps: true
    }
);

const Code = mongoose.model("Code", codeSchema);

export default Code;