import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    roomCode: {type: String, required: true},
    // roomType: {type: String, required: true, enum: ["waiting", "gaming"]},
    sender: {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        username: {type: String, required: true},
        avatar: {type: String, required: true},
    },
    message: {type: String, required: true},
    timestamp: {type: Date, default: Date.now()},
    createdAt: {type: Date, default: Date.now()},
});

messageSchema.index({roomCode: 1, timestamp: 1, createdAt: 1});

export const Message = mongoose.model("Message", messageSchema);