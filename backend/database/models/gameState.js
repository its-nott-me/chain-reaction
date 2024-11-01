import mongoose from "mongoose";

const gameStateSchema = new mongoose.Schema({
    slotName: String,
    slotIndex: Number,
    gridSize: {
        rows: Number,
        cols: Number,
    }, // is this right? ...idk
    gridState: Array,
    currentPlayerIndex: Number,
    playersState: Array,
    playerHasPlayed: Array,
    createdAt: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
});

const gameState = mongoose.model("GameState", gameStateSchema)
export default gameState;