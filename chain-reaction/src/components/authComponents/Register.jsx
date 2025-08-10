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
                <Header/>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center relative">
                {/* Animated Grid Background */}
                
                {/* Main Content */}
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


                {/* Registration Form */}
                <div className="z-10 w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Create Your Account</h2>
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                onClick={() => setShowAvatars(!showAvatars)}
                            >
                                {showAvatars ? "Hide Avatars" : "Choose an Avatar"}
                            </button>
                            {showAvatars && (
                                <div className="p-4 mt-4 border border-gray-300 rounded-lg">
                                    <h3 className="mb-2 text-center text-gray-600">Select Your Avatar</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {avatars.map((avatar, index) => (
                                            <img
                                                key={index}
                                                src={avatar}
                                                alt={`Avatar ${index}`}
                                                onClick={() => setSelectedAvatar(avatar)}
                                                className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                                                    selectedAvatar === avatar ? "border-pink-500" : "border-transparent"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                            Register
                        </button>
                    </form>
                    {error && (
                        <p className="mt-4 text-center text-red-500">
                            {error}
                            {showLogin && (
                                <a href="/login" className="ml-1 text-blue-500 underline">
                                    logging in
                                </a>
                            )}
                        </p>
                    )}
                    <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-indigo-600 font-semibold hover:underline"
                                >
                                    Login here
                                </a>
                            </p>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
