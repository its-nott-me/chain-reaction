import express from "express";
import { createClient } from "redis";
import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from "cookie-parser";
import session from "express-session";
import RedisStore from "connect-redis";

//setup redis client
const redisClient = createClient();
await redisClient.connect(); // connect to redis

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: ["http://localhost:3000", "https://admin.socket.io"], // allow requests from frontend
        methods:["GET", "POST"],
        credentials: true,
    }
});
const port = 5000;
const client = createClient();

// -- Middlewares --
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// session setup
app.use(session({
    store: new RedisStore({ client: redisClient }),
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
    clientID: "<Client_ID>",
    clientSecret: "<Client_Secret>",
    callbackURL: "<Callback_URL>"
},(accessToken, refreshToken, profile, done) => {
    // save user profile info or store it in a db
    return done(/*error*/null, /*data*/profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null ,user);
});


// -- Redis configs --
// Connect to Redis
await client.connect();
console.log("Connected to Redis...");
client.on("error", (err) => console.log("Redis Client Error", err));

// Set a value in Redis
client.set("greeting", "Hello from Redis", (err, reply) => {
    if (err) {
        console.log(err);
    }
    console.log("Redis SET reply:", reply);
});


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
// Retrieve the value from Redis
app.get("/", (req, res) => {
    res.send("Welcome to chian reaction");
});

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
    passport.authenticate("google", {failureRedirect: "/login"}),
    (req, res) => {
        console.log("user info: ", req.user);
        res.redirect("/profile"); // redirect on success
    }
)

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




//logout route
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err){
            console.error("Error during logout: ", err);
            return res.status(500).json({message: "error during logou8t"});
        }
        req.session.destroy();
        res.clearCookie('connect.sid', {path: "/"});

        redisClient.del(`sess:${req.sessionID}`, (err) => {
            if (err) {
                console.error("Error deleting sesssion from redis: ", err);
                return next(err);
            }

            console.log("deleting session from redis");
            res.clearCookie("connect.sid", {
                path: "/",
                secure: "false"
            })
            console.log("Session destroyed");
        })

        res.status(200).send("Logged out successfully");
    });
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

