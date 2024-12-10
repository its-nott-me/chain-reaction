import mongoose from "mongoose";

const roomCodeSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    // type: { type: String, enum: ["private", "public"], required: true },
    // started: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    // status: {type: String, enum: ["started", "waiting"], default: "waiting", requried: true}
})

roomCodeSchema.index({ createdAt: 1}, { expireAfterSeconds: 86400 });

const RoomCode = mongoose.model("RoomCode", roomCodeSchema);
export default RoomCode;