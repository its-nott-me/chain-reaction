import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Leaderboard = ({ players, gameOver }) => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    // Find the winning player (the one with the highest score)
    const winner = sortedPlayers.reduce((prev, current) =>
        prev.score > current.score ? prev : current
    );

    return (
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
            <div className="space-y-4">
                <AnimatePresence>
                    {sortedPlayers.map((player, index) => (
                            <motion.div
                                key={player.index}
                                className={`relative flex items-center justify-between p-3 rounded-lg transition-all ${
                                    player.lost
                                        ? "bg-gray-500 text-gray-400 opacity-50" // Style for lost players
                                        : index === 0
                                        ? "bg-yellow-500 text-gray-900"
                                        : "bg-gray-700"
                                } ${gameOver && player.index === winner.index ? "border-4 border-yellow-400" : ""}`}
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
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-red-600 font-bold opacity-75">
                                        X
                                    </div>
                                )}
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-8 h-8 rounded-full"
                                        style={{ backgroundColor: player.color }}
                                    />
                                    <span className={`font-semibold ${player.lost ? "line-through" : ""}`}>
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
                    className="mt-6 text-center text-3xl font-bold text-yellow-500"
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
