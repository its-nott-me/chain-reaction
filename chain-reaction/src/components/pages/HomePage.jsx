import React from "react";
import Header from "../headers/Header";
import OAuthButton from "../authComponents/OAuthButton";
import LogoutButton from "../authComponents/LogoutButton";

    function HomePage() {
    return ( //
        <div className="min-h-screen bg-game-gradient text-white flex flex-col items-center relative overflow-hidden">
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

            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="w-full max-w-3xl mt-10 text-center space-y-6 z-10">
                <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-orange-300">
                Welcome to Chain Reaction!
                </h1>
                <p className="text-lg text-gray-100">
                Get ready for some explosive fun! Choose how you want to play:
                </p>

                {/* Links */}
                <div className="grid grid-cols-2 gap-6">
                <a
                    href="/offline"
                    className="bg-blue-500 hover:bg-blue-400 text-lg font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-110"
                >
                    Play Offline
                </a>
                <a
                    href="/online"
                    className="bg-green-500 hover:bg-green-400 text-lg font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-110"
                >
                    Play Online
                </a>
                <a
                    href="/register"
                    className="bg-purple-500 hover:bg-purple-400 text-lg font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-110"
                >
                    Register
                </a>
                <a
                    href="/login"
                    className="bg-orange-500 hover:bg-orange-400 text-lg font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-110"
                >
                    Login
                </a>
                </div>

                {/* Authentication Buttons */}
                <div className="grid grid-cols-2 gap-6">
                <OAuthButton />
                <LogoutButton />
                </div>
            </div>
        </div>
    );
    }

export default HomePage;
