import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Leaderboard = ({ players, gameOver }) => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    // Find the winning player (the one with the highest score)
    const winner = sortedPlayers.reduce((prev, current) =>
        prev.score > current.score ? prev : current
    );

    return (
        <div className="bg-gradient-to-r from-lavender-magenta to-pink-300 text-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
            <div className="space-y-4">
                <AnimatePresence>
                    {sortedPlayers.map((player, index) => (
                            <motion.div
                                key={player.index}
                                className={`relative flex items-center justify-between p-3 rounded-lg transition-all ${
                                    player.lost
                                        ? "bg-gradient-to-r from-[#FF7A90] to-[#FFC05E]" // Style for lost players
                                        : index === 0
                                        ? "bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-400 text-[#D459D3]"
                                        : "bg-gradient-to-r from-blue-400 to-blue-600"
                                } ${gameOver && player.index === winner.index ? "border-4 border-yellow-300" : ""}`}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: gameOver && player.index === winner.index ? 1.1 : 1,
                                    boxShadow: gameOver && player.index === winner.index
                                        ? "0px 0px 10px 2px rgba(255, 215, 0, 1)"
                                        : "none",
                                    transition: {
                                        duration: 0.5,
                                        ease: "easeInOut",
                                    },
                                }}
                                exit={{ opacity: 0, y: 20 }}
                                layout
                            >
                                {/* "X" Overlay for Lost Players */}
                                {player.lost && (
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#ff0050] font-bold opacity-75">
                                        X
                                    </div>
                                )}
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-8 h-8 rounded-full"
                                        style={{ backgroundColor: player.color }}
                                    />
                                    <span className={`font-bold ${!player.hasPlayed ? "" : (player.index === winner.index) ? "text-[#D459D3]" : "text-[#FEF08A]"}`}>
                                        {player.name}
                                    </span>
                                </div>
                                <span className="text-lg font-semibold">
                                    {player.score}
                                </span>
                            </motion.div>
                        ))}
                </AnimatePresence>
            </div>

            {/* Game Over Banner */}
            {gameOver && (
                <motion.div
                    className="mt-6 text-center text-3xl font-bold text-[#ffee38]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3>Game Over! {winner.name} is the Winner!</h3>
                </motion.div>
            )}
        </div>
    );
};

export default Leaderboard;
