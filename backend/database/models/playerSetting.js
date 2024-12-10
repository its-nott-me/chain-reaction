import mongoose from "mongoose";

const playerSettingSchema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    color: {type: String, required: true},
    roomCode: {type: String, required: true},
    createdAt: {type: Date, default: Date.now()},
});

playerSettingSchema.index({roomCode: 1, createdAt: -1});

const PlayerSetting = mongoose.model("PlayerSetting", playerSettingSchema);
export default PlayerSetting;