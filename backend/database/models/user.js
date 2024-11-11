import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    oauthProvider: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    profilePicture: { type: String },
    password: { type: String },
    joinedDate: { type: Date, default: Date.now },
    gameStates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameState' }],
});

// Compound index on oauthProvider and googleId, allowing multiple null googleId values for "local" providers
// userSchema.index({ oauthProvider: 1, googleId: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
