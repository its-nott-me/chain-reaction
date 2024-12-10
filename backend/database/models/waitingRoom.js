import mongoose from "mongoose";

const waitingRoomSchema = new mongoose.Schema({
    roomData: {type: mongoose.Schema.Types.ObjectId, ref: "RoomCode"},
    gridSize: {
        rows: {type: Number, default: 12},
        cols: {type: Number, default: 6}
    },
    players: Array,
    owner: {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        email: {type: String, required: true}
    },
    createdAt: {type: Date, default: Date.now()}
});

waitingRoomSchema.index({createdAt: 1}, {expireAfterSeconds: 1*60*60});

const WaitingRoom = mongoose.model("WaitingRoom", waitingRoomSchema);
export default WaitingRoom; 