import express from "express";
// import { createClient } from "redis";
import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
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
import bcrypt from "bcrypt";


dotenv.config();

//setup redis client
// const redisClient = createClient();
// await redisClient.connect(); // connect to redis

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: ["http://localhost:3000", "https://admin.socket.io"], // allow requests from frontend
        methods:["GET", "POST"],
        credentials: true,
    }
});

// const client = createClient();

// -- Middlewares --
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// session setup
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: "reactionInReact",
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: "/",
        secure: false,// false for http and treu for https
        maxAge: 24*60*60*1000,
        httpOnly: true,
        domain: "localhost"
    },
}));
// passport setup
app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/auth/google");
}

// passport strategy setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},async (accessToken, refreshToken, profile, done) => {
    // save user profile info or store it in a db
    // try {
    //     // The profile object contains the authenticated user's Google data
    //     const user = {
    //         oauthProvider: 'google',
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
            console.log(email, password);
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

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
})


// -- Express Configs --
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
                oauthProvider: 'google',
                googleId: req.user.id, // From Google OAuth response
                username: req.user.displayName, // From Google OAuth response
                email: req.user.emails[0].value, // From Google OAuth response
                profilePicture: req.user.photos[0].value, // From Google OAuth response
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
            
            res.redirect("http://localhost:3000"); // Redirect on success
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
app.get("/getUserData", (req, res) => {
    if(req.isAuthenticated()){
        res.send(req.user);
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
    const { email, password, username } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            oauthProvider: "local",
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
            console.log("id: ", user._id, "\ngamestate_id: ", gameState._id);
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
    const email = req.user?.oauthProvider === "local" ? req.user.email : req.user._json.email;
    console.log(email, req.body.gameData);
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
    const email = req.user?.oauthProvider === "local" ? req.user.email : req.user._json.email;
    try {
        const saves = await retrieveSavesAbstract(email);
        console.log(saves);
        res.send(saves).status(200); 
    } catch (error) {
        console.error("Error in retreiving abstract of saves: ", error);
        res.sendStatus(500);
    }
});
app.get("/retrieveSaves", async (req, res) => {
    // console.log(req.user);
    const email = req.user?.oauthProvider === "local" ? req.user.email : req.user._json.email;
    try {
        const saves = await retrieveSaves(email);
        console.log(saves);
        res.send(saves).status(200); 
    } catch (error) {
        console.error("Error in retreiving abstract of saves: ", error);
        res.sendStatus(500);
    }
});

app.post("/renameSave", async (req, res) => {
    const email = req.user?.oauthProvider === "local" ? req.user.email : req.user._json.email;
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

