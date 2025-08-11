import React from "react";
import Header from "../headers/Header";

function HowToPlayPage() {
    return (
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
            <div className="w-full max-w-3xl mt-10 text-center space-y-6 z-10 mb-6">
                <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-orange-300">
                    How to Play Chain Reaction
                </h1>
                <p className="text-lg text-gray-100">
                    Master the game by placing orbs, causing explosions, and taking over the board!
                </p>

                {/* Instructions with Improved Clarity and Contrast */}
                <div className="text-left text-lg text-gray-900 space-y-6 mt-6 bg-white bg-opacity-20 p-6 rounded-lg shadow-md backdrop-blur-sm">
                    <h2 className="text-2xl font-semibold text-yellow-400 mb-2">🎯 Game Goal</h2>
                    <p>
                        Your goal is to win by removing all the orbs that belong to the other players.
                        The last player with orbs left on the board wins the game.
                    </p>

                    <h2 className="text-2xl font-semibold text-green-400 mt-4 mb-2">🧩 How the Game Works</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Players take turns, one after another.</li>
                        <li>You can place an orb in any square that’s empty or already has your orbs.</li>
                        <li>
                            Each square can only hold a few orbs before it bursts:
                            <ul className="ml-6">
                                <li>Corner squares hold 1 orb</li>
                                <li>Edge squares hold 2 orbs</li>
                                <li>Middle squares hold 3 orbs</li>
                            </ul>
                        </li>
                        <li>When a square is full and you add one more, it explodes!</li>
                        <li>The orbs move to nearby squares (up, down, left, right).</li>
                        <li>If those squares become full too, they also explode — this is called a chain reaction!</li>
                        <li>If your orb lands on an enemy’s orb, it changes to your color — now that square belongs to you.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-pink-700 mt-4 mb-2">🏆 How to Win</h2>
                    <p>
                        Keep placing orbs and try to cause chain reactions that spread across the board.
                        If a player loses all their orbs, they’re out.
                        Be the last player with orbs left, and you win!
                    </p>
                </div>

                {/* Back Button */}
                <a
                    href="/"
                    className="my-8 inline-block bg-blue-500 hover:bg-blue-400 text-lg font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    ⬅ Back to Home
                </a>
            </div>
        </div>
    );
}

export default HowToPlayPage;
