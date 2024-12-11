import express from "express";
// import { createClient } from "redis";
import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
import passport, { Passport } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy } from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
// import RedisStore from "connect-redis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import User from "./database/models/user.js";
import GameState from "./database/models/gameState.js"
import bcrypt from "bcryptjs";
import RoomCode from "./database/models/roomCode.js";
import { Message } from "./database/models/message.js";
import PlayerSetting from "./database/models/playerSetting.js";
import OnlineGameState from "./database/models/onlineGameState.js";
import WaitingRoom from "./database/models/waitingRoom.js";


dotenv.config();

//setup redis client
// const redisClient = createClient();
// await redisClient.connect(); // connect to redis

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: ["http://localhost:3000", "https://admin.socket.io", `${process.env.FRONTEND_URL}`], // allow requests from frontend
        methods:["GET", "POST"],
        credentials: true,
    }
});
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const client = createClient();

// -- Middlewares --
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '..', 'chain-reaction', 'build')));

// session setup
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: "reactionInReact",
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: "/",
        secure: true,// false for http and treu for https
        maxAge: 24*60*60*1000,
        httpOnly: true,
        domain: ".onrender.com" // "localhost" for development
    },
}));
// passport setup
app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// passport strategy setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},async (accessToken, refreshToken, profile, done) => {
    // save user profile info or store it in a db
    // try {
    //     // The profile object contains the authenticated user's Google data
    //     const user = {
    //         provider: 'google',
    //         googleId: profile.id,
    //         username: profile.displayName,
    //         email: profile.emails[0].value,
    //         profilePicture: profile.photos[0]?.value // Optional
    //     };

    //     // Check if the user already exists in the database
    //     let existingUser = await User.findOne({ googleId: user.googleId });

    //     if (!existingUser) {
    //         // Create and save new user if they don't exist
    //         existingUser = new User(user);
    //         await existingUser.save();
    //     }

    //     return done(null, existingUser); // Pass the user object to the next middleware
    // } catch (error) {
    //     return done(error, null);
    // }

    return done(null, profile);
}));

passport.use("local", 
    new Strategy(
        {usernameField: "email", passReqToCallback: true},
        async function verify (req, email, password, done){
            // console.log(email, password);
            try{
                const user = await User.findOne({email: email});
                if(!user){
                    return done(null, false, {message: "Email not registered"});
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch){
                    return done (null, false, {message: "Incorrect password"});
                }

                return done(null, user);
            } catch(error){
                return done(error);
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});



// -- Redis configs --
// Connect to Redis
// await client.connect();
// console.log("Connected to Redis...");
// client.on("error", (err) => console.log("Redis Client Error", err));

// // Set a value in Redis
// client.set("greeting", "Hello from Redis", (err, reply) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log("Redis SET reply:", reply);
// });


// MongoDB connect
mongoose.connect(process.env.MONGODB_URI, {
    tlsAllowInvalidCertificates: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error: ", err))


// -- Socket Congfigs --
instrument(io, {
    auth: false,
    mode: "development",
});

io.on("connection", (socket) => {
    console.log("connected to socket");

    // -------------------online game socket emits-----------------------
    // Y-game-room --> incoming
    // game-room-Z --> outgoing
    socket.on("create-wait-room", async (roomCode, user) => {
        socket.join(roomCode);
        socket.emit("wait-room-created", roomCode);
        console.log("room with code", roomCode, "created");
        try{
            const roomCodeEntry = new RoomCode({code: roomCode});
            await roomCodeEntry.save();

            // check if this works..
            const waitingRoomEntry = new WaitingRoom({
                roomData: roomCodeEntry._id,
                owner: {email: user.email, userId: user.userId},
                playerIds: [user.userId],
            }); // it works
            const entry = await waitingRoomEntry.save();
            console.log("waitingRoom: ", entry);
        } catch (error) {
            console.log("Error creating waiting room: ", error)
        }
        
    }) // ig ¯\_(ツ)_/¯ 

    socket.on("join-wait-room", async(roomCode) => {
        const size = io.sockets.adapter.rooms.get(roomCode)?.size || 0;
        // if(size === 0){
        //     socket.emit("invalid-room-code") // this sint working bcoz socket isnt stable
        // }
        
        const room = await RoomCode.findOne({code: roomCode});
        if(!room){
            socket.emit("invalid-room-code");
        } else if (size >= 10){
            socket.leave(roomCode);
            socket.emit("wait-room-full");
        } else {
            socket.join(roomCode);
            const updatedSize = io.sockets.adapter.rooms.get(roomCode)?.size || 0;
            console.log(`Joined room (code): ${roomCode}, size: ${updatedSize}`);
            socket.emit("wait-room-joined");
        }
    });

    socket.on("send-message", async (messageData, email) => {
        const userId = await getUserIdByEmail(email);
        const message = new Message({
            ...messageData, 
            sender: {
                ...messageData.sender, 
                userId
            }}
        );

        message.save();
        socket.broadcast.to(messageData.roomCode).emit("new-message", messageData);
    });

    socket.on("size-wait-room", (roomCode) => {
        const size = io.sockets.adapter.rooms.get(roomCode)?.size || 1;
        socket.emit("wait-room-size", size);
    });

    socket.on("new-player", async (playerData) => {
        // console.log("player's data: ", playerData);
        socket.broadcast.to(playerData.roomCode).timeout(1000).emit("player-added", playerData);
        await PlayerSetting.findOneAndUpdate(
            {
                roomCode: playerData.roomCode,
                email: playerData.email,
                color: playerData.color
            }, // conditions
            playerData, // updated doc
            { upsert: true, returnDocument: "after", new: true } // create new entry if no entry found 
        );

        const roomCodeEntry = await RoomCode.findOne({code: playerData.roomCode});
        await WaitingRoom.findOneAndUpdate(
            { roomData: roomCodeEntry._id },
            {
                $addToSet: {
                    players: playerData,
                    playerIds: playerData.userId
                }
            }
        )
    });

    socket.on("leave-waiting-room", async (player) => {
        // if game room is 1 and the client leaves... then delete online gaemstate too
        // console.log(player);
        try{
            const size = io.sockets.adapter.rooms.get(player.roomCode)?.size || 0;
            console.log("leaving room ", player.roomCode);
            const roomCodeEntry = await RoomCode.findOne({code: player.roomCode});

            if(size === 1){
                // waaaaaaaaa bcoz of sockets not being handled properly
                // i messed up in structuring this and now its all messed up.. i cant delete waiting rooms manually
                // or else there'll be a problem when 
                // await WaitingRoom.findOneAndDelete({roomData: roomCodeEntry._id});
                console.log("waiting room deleted");
            } else {
                const waitingRoomEntry = await WaitingRoom.findOne({roomData: roomCodeEntry._id});
                const owner = waitingRoomEntry.owner;
                // if the owner is leaving assign a random player to be the owner
                // console.log("owner email: ", owner.email, "player email: ", player.email);
                if(player.email === owner.email){
                    // console.log("owner email: ", owner.email, "player email: ", player.email);

                    const updatedOwner = {
                        email: waitingRoomEntry.players[1].email,
                        userId: waitingRoomEntry.players[1].userId,
                    }
                    await WaitingRoom.updateOne({$set: {owner: updatedOwner}});
                    socket.broadcast.to(player.roomCode).emit(
                        "owner-updated", 
                        {
                            email: waitingRoomEntry.players[1].email,
                            userId: waitingRoomEntry.players[1].userId,
                        }
                    );
                }

                const updatedPlayers = waitingRoomEntry.players.filter(user => user.email != player.email)
                await WaitingRoom.updateOne({$set: {players: updatedPlayers}});

                console.log("left room");
            }

            // why deleteMany ❓
            // nthn nhtn.. i fixed it
            await PlayerSetting.findOneAndDelete({email: player.email, roomCode: player.roomCode});

            socket.broadcast.to(player.roomCode).emit("waiting-room-left", player.email);
        } catch (error){
            console.log("Error removing player from waiting room: ", error);
        }
    });

    socket.on("update-player-settings", async(playerData) => {
        socket.broadcast.to(playerData.roomCode).emit("player-settings-updated", playerData);
        
        await PlayerSetting.updateMany(
            { email: playerData.email },
            {$set: {
                username: playerData.username,
                color: playerData.color,
                roomCode: playerData.roomCode,
                }
            },
            { new: true, upsert: true }
        );
    });

    socket.on("update-avatar", async(avatarURL, userId) => {
        await User.findOneAndUpdate({_id: userId}, {profilePicture: avatarURL});
    })

    socket.on("start-game", async (roomCode, gridSize) => {
        try{
            const roomCodeEntry = await RoomCode.findOne({code: roomCode});
            const waitingRoomEntry = await WaitingRoom.findOne({roomData: roomCodeEntry._id});
            // console.log("waiting room entry: ", waitingRoomEntry);
            const owner = await User.findOne({_id: waitingRoomEntry.owner.userId});
            const playerIds = waitingRoomEntry.players.map(player => player.userId);
            // u dumbhead u r mutating players while playersState is being used -_-
            // oh sorry i didnt see that o(￣┰￣*)ゞ
            const players = await Promise.all(
                waitingRoomEntry.players.map(async (player, index) => {
                    const settings = await PlayerSetting.findOne({email: player.email});
                    await PlayerSetting.deleteMany({email: player.email});
                    console.log("player:", player);
                    return {
                        email: player.email,
                        id: player.userId,
                        score: 0,
                        index,
                        lost: false,
                        hasPlayed: false,
                        color: settings.color,
                        name: settings.username,
                    }
                })
            )
            console.log("waitingRoomEntry: ", waitingRoomEntry);

            // dont use spread operator on waitingRoomEntry to fill gridSize and players.. 
            // it doesnt work..
            // dk why and dont ask why
            const data = {
                playerIds,
                gridSize,
                players,
                slotIndex: owner.onlineGameStates.length,
                owner: {
                    email: owner.email,
                    userId: owner._id,
                },
                gridState: Array.from({length: gridSize.rows}, () => {
                    return Array.from({length: gridSize.cols}, () => {
                        return {
                            orbs: 0,
                            owner: null,
                            explode: false,
                        }
                    })
                })
            }
            console.log("data: ", data);
            const onlineGameStateEntry = new OnlineGameState( data );
            const savedEntry = await onlineGameStateEntry.save(); // ◑﹏◐ plsss work
            console.log(savedEntry);
            // add onlinegamestate object id to user's entry array
            // console.log("\ngridState: ", onlineGameStateEntry.gridState)
            await User.findOneAndUpdate(
                { _id: waitingRoomEntry.owner.userId },
                { $push: { onlineGameStates: onlineGameStateEntry._id } }
            );

            io.sockets.in(roomCode).emit("game-started");
        } catch (error) {
            console.log("Error starting online game: ", error);
        }
    });

    socket.on("join-game-room", (roomId) => {
        socket.join(roomId);
        console.log("game room joined, roomId", roomId);
    })

    socket.on("update-grid-size", async(roomCode, gridSize) => {
        console.log("gridsize: ", gridSize);
        const roomCodeEntry = await RoomCode.findOne({code: roomCode});
        await WaitingRoom.findOneAndUpdate(
            {roomData: roomCodeEntry._id},
            { $set: { gridSize } },
        )
        socket.broadcast.to(roomCode).emit("grid-size-updated", gridSize);
    });

    socket.on("switch-players", (nextPlayerIndex, roomId) => {
        socket.broadcast.to(roomId).emit("players-switched", nextPlayerIndex);
        console.log("next player index: ", nextPlayerIndex);
    });

    socket.on("add-orb", (playerIndex, row, col, orbs, roomId) => {
        socket.broadcast.to(roomId).emit("orb-added", playerIndex, row, col, orbs);
        console.log("player index: ", playerIndex, "Row: ", row, "col: ", col, "orbs: ", orbs);
    });

    socket.on("increment-score", (score, playerIndex, roomId) => {
        io.to(roomId).emit("score-incremented", score, playerIndex);
    });

    socket.on("player-lost", (playerIndex, roomId) => {
        socket.broadcast.to(roomId).emit("lost-player", playerIndex);
    });

    socket.on("leave-game-room", async (roomId) => { // user contains only userId
        const roomSize = io.sockets.adapter.rooms.get(roomId).size;
        console.log("roomSize: ", roomSize);
        if(roomSize === 1){
            await Message.deleteMany({roomCode: roomId});
        }
    });

    socket.on("restart-game", (roomId, roomCode) => {

        io.to(roomId).emit("game-restarted", roomCode);
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
})


// -- Express Configs --
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'chain-reaction', 'build', 'index.html'));
// });
app.get("/", (req, res) => {
    res.send("Welcome to chain reaction");
});


// Retrieve the value from Redis
// app.get("/greeting", async (req, res) => {
//     const greeting = await client.get("greeting");
//     res.send(greeting);
// }); // for testing redis-cli... first setup the key "greeting" in redis-cli

// Routes for OAuth2
app.get("/auth/google", (req, res, next) => {
    // allow if authenticated
    if(req.isAuthenticated()){
        return res.redirect("/profile");

    // redirect to login if not authenticated
    } else {
        passport.authenticate("google", {
            scope: ["profile", "email"],
            prompt: "select_account",
        })(req, res, next);
    }
});

// handling success and failed login 
app.get("/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        try {
            // Extract user data from the Google OAuth response
            const userData = {
                provider: 'google',
                googleId: req.user.id, // From Google OAuth response
                username: req.user.displayName, // From Google OAuth response
                email: req.user.emails[0].value, // From Google OAuth response
                profilePicture: "https://cdn-icons-png.flaticon.com/256/1752/1752776.png", // From Google OAuth response
            };

            // Check if the user already exists in the database
            const existingUser = await User.findOne({ googleId: userData.googleId });

            if (!existingUser) {
                // If the user does not exist, create a new user
                const newUser = new User(userData);
                await newUser.save(); // Save the new user to the database
            }

            // User is authenticated, redirect to the profile page
            // res.redirect("/profile");
            
            res.redirect(process.env.FRONTEND_URL); // Redirect on success
        } catch (error) {
            console.error('Error during Google OAuth callback:', error);
            res.redirect("/login"); // Redirect to login on error
        }
    }
);

//route to check session
app.get("/profile", (req, res) => {
    if(req.isAuthenticated()){
        console.log("authenticated");
        res.send(`Hellow ${req.user.displayName}`);
    } else {
        console.log("not authentuicated");
        res.redirect("/auth/google");
    }
})

//check if authenticated
app.get("/auth/check", (req, res) => {
    try{
        res.send(req.isAuthenticated());
    } catch (err){
        // why would you even get an error here?? -_-
        console.log("error checking authentication");
    }
});

// send currently logged-in user data
app.get("/getUserData", async(req, res) => {
    if(req.isAuthenticated()){
        // google provider
        let user;
        if(req.user.provider === "google"){
            user = {
                username: req.user.displayName,
                email: req.user.emails[0].value,
            }
        } else {
            user = {
                username: req.user.username,
                email: req.user.email,
            }
        }
        const userDB = await User.findOne({email: user.email});
        user = {...user, userId: userDB._id, avatar: userDB.profilePicture};
        // console.log(user);
        res.send(user);
    } else {
        res.status(401).send("not authenticated");
    }
})


// local auth routes
app.post("/auth/local", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
}))

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Error in authentication", err);
            return next(err);
        }
        if (!user) {
            // console.log("Login failed:", info);
            return res.sendStatus(401);
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                console.error("Error in login", loginErr);
                return next(loginErr);
            }
            res.sendStatus(200);
        });
    })(req, res, next);
});


app.post("/register", async (req, res) => {
    const { email, password, username, avatar } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            provider: "local",
            profilePicture: avatar,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();
        return res.status(201).json({ message: "Registration successful" }); // Respond with JSON success message
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

//logout route
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout: ", err);
            return res.status(500).json({ message: "Error during logout" });
        }

        // Destroy session stored in MongoDB
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session: ", err);
                return res.status(500).json({ message: "Error destroying session" });
            }

            // Clear session cookie
            res.clearCookie("connect.sid", {
                path: "/",
                secure: false // Use true if serving over HTTPS
            });

            console.log("Session destroyed and user logged out");
            res.status(200).send("Logged out successfully");
        });
    });
});


async function saveGameState(email, gameData) {
    try {
        // Find the user by googleId, not _id
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        
        let gameState = await GameState.findOne({user: user._id, slotIndex: gameData.slotIndex})
        // Create and save the game state
        if(gameState){
            // updating xisiting gaemstate
            Object.assign(gameState, gameData);
            await gameState.save();
            
        } else {
            gameState = new GameState({
                ...gameData,
                user: user._id,
            });
            await gameState.save();
            // console.log("id: ", user._id, "\ngamestate_id: ", gameState._id);
            // Update the user by googleId to add the gameState
            await User.findOneAndUpdate(
                { email: email },
                { $push: { gameStates: gameState._id } }
            );
        }

        console.log("Game state saved successfully");
    } catch (err) {
        console.error("Error saving game state:", err);
    }
}

// save game endpoint
app.post("/saveGame", (req, res) => {
    const email = req.user?.provider === "local" ? req.user.email : req.user._json.email;
    // console.log(email, req.body.gameData);
    saveGameState(email, req.body.gameData)
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
});



async function retrieveSavesAbstract(email) {
    try {
        const user = await User.findOne({ email });
        if (!user || user.gameStates.length === 0) {
            return [];
        }

        // Retrieve all game states in parallel
        const saves = await Promise.all(
            user.gameStates.map(async (id) => {
                const save = await GameState.findOne({ _id: id, user: user._id }).select("slotIndex slotName").exec();
                return save;
            })
        );

        return saves;
    } catch (error) {
        console.error("Error retrieving saves:", error);
        return [];
    }
}
async function retrieveSaves(email) {
    try {
        const user = await User.findOne({ email });
        if (!user || user.gameStates.length === 0) {
            return [];
        }

        // Retrieve all game states in parallel
        const saves = await Promise.all(
            user.gameStates.map(async (id) => {
                const save = await GameState.findOne({ _id: id, user: user._id });
                return save;
            })
        );

        return saves;
    } catch (error) {
        console.error("Error retrieving saves:", error);
        return [];
    }
}
// Retrieve saves endpoint
app.get("/retrieveSaves/abstract", async (req, res) => {
    const email = req.user?.provider === "local" ? req.user.email : req.user._json.email;
    try {
        const saves = await retrieveSavesAbstract(email);
        // console.log(saves);
        res.send(saves).status(200); 
    } catch (error) {
        console.error("Error in retreiving abstract of saves: ", error);
        res.sendStatus(500);
    }
});

app.get("/retrieveSaves", async (req, res) => {
    // console.log(req.user);
    const email = req.user?.provider === "local" ? req.user.email : req.user._json.email;
    try {
        const saves = await retrieveSaves(email);
        // console.log(saves);
        res.send(saves).status(200); 
    } catch (error) {
        console.error("Error in retreiving abstract of saves: ", error);
        res.sendStatus(500);
    }
});

app.post("/renameSave", async (req, res) => {
    const email = req.user?.provider === "local" ? req.user.email : req.user._json.email;
    const { slotIndex, newName } = req.body; // Use slotIndex from request

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("User not found.");
        
        // Search for the game state with matching slotIndex
        const gameStateId = await GameState.findOneAndUpdate({user: user._id, slotIndex}, {slotName: newName})
        if (!gameStateId) return res.status(404).send("Game state not found in this slot.");

        res.sendStatus(200);
    } catch (err) {
        console.error("Error renaming slot: ", err);
        res.sendStatus(500);
    }
});


// ------------------------------ Online routes ---------------------------

//generate room codes
function generateRoomCode(){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvxyz";
    let code = "";
    for(let i = 0; i < 6; i++){
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}
async function createUniqueRoomCode(){
    let code;
    let unique = false;

    while(!unique){
        code = generateRoomCode();
        const existingCode = await RoomCode.findOne({code});
        if(!existingCode) unique = true;
    }

    return code;
}
async function getUserIdByEmail(email){
    try{
        const user = await User.findOne({email});
        if(user){
            return user._id;
        } else {
            throw new Error("User not found");
        }
    } catch (error){
        console.error("Error fetching user: ", error);
        throw error;
    }
}

// protect this route using authentication
app.post("/createRoomCode", async(req, res) => {
    const {roomType} = req.body;
    // console.log(req.body);

    try{
        const roomCode = await createUniqueRoomCode(roomType);
        res.status(200).json({roomCode});
    } catch(error){
        console.error("Error generating room codes: ", error);
        res.sendStatus(500);
    }
});

app.get("/messages/:roomCode", async(req, res) => {
    const {roomCode} = req.params;
    try{
        const messages = await Message.find({roomCode}).sort({timestamp: 1, _id: 1});
        // console.log(messages);
        res.status(200).json(messages);
    } catch(error){
        console.log("error fetching messages: ", error);
        res.status(500).send("Server error");
    }
});

app.get("/waiting/players/:roomCode", async(req, res) => {
    const {roomCode} = req.params;

    try{
        const players = await PlayerSetting.find({roomCode});
        // console.log(players);
        res.status(200).send(players);
    } catch (error) {
        console.log("Error fetchign settings of players in waiting room: ", error);
        res.status(500).send("Server error");
    }
});

app.get("/getOwnerData/:roomCode", async(req, res) => {
    const {roomCode} = req.params;
    try{
        const roomCodeEntry = await RoomCode.findOne({code: roomCode});
        const waitingRoomEntry = await WaitingRoom.findOne({roomData: roomCodeEntry._id});

        res.send(waitingRoomEntry.owner);
    } catch (error){
        console.log("Error fetching waiting room owner: ", error);
        res.status(500).send("Server error");
    }
});

app.get("/waiting/gridSize/:roomCode", async(req, res) => {
    const {roomCode} = req.params;
    try{
        const roomCodeEntry = await RoomCode.findOne({code: roomCode});
        const waitingRoomEntry = await WaitingRoom.findOne({roomData: roomCodeEntry._id})
        res.send(waitingRoomEntry.gridSize);
    } catch (error) {
        console.log("Error fetching gridSize");
        res.status(500).send("Server error");
    }
});

app.get("/online/gameState/:roomId", async(req, res) => {
    const {roomId} = req.params;
    try{
        const onlineGameStateEntry = await OnlineGameState.findOne({"owner.userId": roomId}).sort({createdAt: -1});
        res.send(onlineGameStateEntry);
        console.log("\n\nretrived entry: ", onlineGameStateEntry);
    } catch (error) {
        console.error("Error retreiving online game state: ", error);
        res.sendStatus(500);
    }
});




// -- Global error handler --
app.use((err, req, res, next) => {
    console.error(err.stack);

    //sending a generic message
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

server.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
});

