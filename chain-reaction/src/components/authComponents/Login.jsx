import React, { useState } from "react";
import axios from "axios";
import Header from "../headers/Header";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to hold error message
    const apiURL = process.env.REACT_APP_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous error

        try {
            const response = await axios.post(`${apiURL}/login`, { email, password }, {withCredentials: true});
            if (response.status === 200) window.location.href = "/";
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Incorrect credentials
                setError("Invalid email or password. Please try again.");
            } else {
                console.error("Error logging in:", error);
                setError("Login failed. Please try again later.");
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
            <div className="z-10 w-full max-w-md p-8 bg-white rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter your credentials
                </p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="yourname@example.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Login
                    </button>
                </form>
                {error && (
                    <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
                )}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            Register here
                        </a>
                    </p>
                </div>
                <div className="mt-2 text-center">
                    <a
                        href={`${process.env.REACT_APP_API_URL}/auth/google`}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Login using Google
                    </a>
                </div>
            </div>
        </div>
    </div>

    );
}

export default Login;
