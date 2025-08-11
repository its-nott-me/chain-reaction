import React, { useState } from "react";
import axios from "axios";
import Header from "../headers/Header"

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const [showAvatars, setShowAvatars] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState("https://cdn-icons-png.flaticon.com/256/1752/1752776.png");
    const apiURL = process.env.REACT_APP_API_URL;

    const avatars = [
        "https://cdn-icons-png.flaticon.com/512/1752/1752691.png", // gastly
        "https://cdn-icons-png.flaticon.com/512/1752/1752772.png", // pikachu
        "https://cdn-icons-png.flaticon.com/512/1752/1752682.png", // duskull
        "https://cdn-icons-png.flaticon.com/512/188/188999.png", // zubat
        "https://cdn-icons-png.flaticon.com/512/188/188994.png", // mankey
        "https://cdn-icons-png.flaticon.com/512/1752/1752724.png", // marill
        "https://cdn-icons-png.flaticon.com/512/1752/1752767.png", // phanpy
        "https://cdn-icons-png.flaticon.com/512/1752/1752813.png", // snorlax
        "https://cdn-icons-png.flaticon.com/512/1752/1752735.png", // meowth,
        "https://cdn-icons-png.flaticon.com/512/1752/1752713.png", // jigglypuff
        "https://cdn-icons-png.flaticon.com/512/1752/1752660.png", // castform
        "https://cdn-icons-png.flaticon.com/512/1752/1752636.png", // bellsprout
        "https://cdn-icons-png.flaticon.com/512/1752/1752640.png", // breloom
        "https://cdn-icons-png.flaticon.com/256/1752/1752655.png", // cacnea
        "https://cdn-icons-png.flaticon.com/256/1752/1752791.png", // rosalia
        "https://cdn-icons-png.flaticon.com/256/1752/1752828.png", // starmie
        "https://cdn-icons-png.flaticon.com/256/1752/1752678.png", // diglett
        "https://cdn-icons-png.flaticon.com/256/1752/1752875.png", // voltorb
        "https://cdn-icons-png.flaticon.com/256/1752/1752835.png", // sudowoodo
        "https://cdn-icons-png.flaticon.com/256/1752/1752780.png", // poliwhirl
        "https://cdn-icons-png.flaticon.com/256/1752/1752890.png", // wingull
        "https://cdn-icons-png.flaticon.com/256/1752/1752719.png", // magnemite
        "https://cdn-icons-png.flaticon.com/256/1752/1752707.png", // hoothoot
        "https://cdn-icons-png.flaticon.com/256/1752/1752633.png", // aron
        "https://cdn-icons-png.flaticon.com/256/1752/1752867.png", // teddy ursa
        "https://cdn-icons-png.flaticon.com/256/1752/1752687.png", // exeggutor
        "https://cdn-icons-png.flaticon.com/256/1752/1752681.png", // ditto,
        "https://cdn-icons-png.flaticon.com/256/1752/1752846.png", // swabblu
        "https://cdn-icons-png.flaticon.com/256/1752/1752716.png", // ladyba
        
        // ---------------- i choose you --------------
        
        "https://cdn-icons-png.flaticon.com/256/1752/1752783.png", // gladion ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752822.png", // GS ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752776.png", // poke ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752871.png", // ultra ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752763.png", // park ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752738.png", // nest ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752705.png", // heavy ball
        // Add more avatar URLs here...
    ];

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${apiURL}/register`, { email, password, username, avatar: selectedAvatar });
            if (response.status === 201) window.location.href = "/login";
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError("User already registered. Please try ");
                setShowLogin(true);
            } else {
                console.error("Error registering:", error);
                setError("Registration failed. Please try again.");
                setShowLogin(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-game-gradient">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 w-full bg-white shadow-md">
                <Header />
            </div>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center relative">

                {/* Animated Grid Background */}
                <div className="absolute inset-0 z-0 grid grid-cols-12 gap-4 opacity-20">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-6 h-6 rounded-full animate-glowPulse ${['bg-pink-200', 'bg-yellow-200', 'bg-purple-200'][Math.floor(Math.random() * 3)]}`}
                            style={{
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 4 + 3}s`,
                            }}
                        ></div>
                    ))}
                </div>

                {/* Floating Orbs */}
                <div className="absolute inset-0 z-0 flex justify-center items-center overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="w-10 h-10 bg-yellow-400 rounded-full animate-bounceOrb shadow-xl"
                            style={{
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${Math.random() * 2 + 2}s`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                position: "absolute",
                            }}
                        ></div>
                    ))}
                </div>

                {/* Form */}
                <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-100 hover:scale-[1.02] transition-transform duration-300">
                    <h2 className="text-3xl font-extrabold text-center text-purple-700">Create Your Account</h2>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-purple-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-1 text-purple-800 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-purple-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-1 text-purple-800 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-purple-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-1 text-purple-800 bg-white border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>

                        {/* Avatar Toggle Button */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowAvatars(!showAvatars)}
                                className="w-full px-4 py-2 text-lg font-semibold text-white bg-pink-500 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            >
                                {showAvatars ? "Hide Avatars" : "Choose an Avatar"}
                            </button>

                            {/* Avatar Grid */}
                            {showAvatars && (
                                <div className="p-4 mt-4 bg-white border-2 border-purple-200 rounded-lg shadow-md">
                                    <h3 className="mb-3 text-center text-purple-700 font-semibold">Select Your Avatar</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {avatars.map((avatar, index) => (
                                            <img
                                                key={index}
                                                src={avatar}
                                                alt={`Avatar ${index}`}
                                                onClick={() => setSelectedAvatar(avatar)}
                                                className={`w-16 h-16 rounded-full cursor-pointer border-4 transition-transform hover:scale-110 ${
                                                    selectedAvatar === avatar ? "border-pink-500" : "border-transparent"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-lg font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            Register
                        </button>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <p className="mt-4 text-center text-red-600 font-medium">
                            {error}
                            {showLogin && (
                                <a href="/login" className="ml-1 text-blue-600 underline hover:text-blue-800">
                                    logging in
                                </a>
                            )}
                        </p>
                    )}

                    {/* Login Link */}
                    <div className="text-center text-sm text-purple-600">
                        Already have an account?{" "}
                        <a href="/login" className="font-semibold text-indigo-600 hover:underline">
                            Login here
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
