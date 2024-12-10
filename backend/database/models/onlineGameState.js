import mongoose from "mongoose";

const onlineGameStateSchema = new mongoose.Schema({
    roomData: { type: mongoose.Schema.Types.ObjectId, ref: "RoomCode" },
    gridState: Array,
    // playersState: Array,
    players: Array, // email, username, objectId
    currentPlayerIndex: {type: Number, default: 0}, 
    slotIndex: Number,
    slotName: {type: String, default: "Empty slot"},
    gridSize: {
        rows: Number,
        cols: Number,
    },
    owner: { 
        email: {type: String, required: true},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    },
    playerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: {type: Date, default: Date.now()},
})

// game state and waiting state should differ

onlineGameStateSchema.index({createdAt: -1}, {expireAfterSeconds: 3600});

const OnlineGameState = mongoose.model("OnlineGameState", onlineGameStateSchema);
export default OnlineGameState;