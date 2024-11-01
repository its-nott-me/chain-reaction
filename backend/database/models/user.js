import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    oauthProvider: {type: String, required: true},
    googleId: {type: String, unique: true},
    username: {type: String, requried: true},
    email: {type: String, unique: true, requried: true},
    profilePicture: {type: String},
    password: {type: String},
    joinedDate: {type: Date, default: Date.now},
    gameStates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameState' }],
})

const user = mongoose.model("user", userSchema);
export default user;