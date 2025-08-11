import React, { useEffect, useState } from 'react';

function PlayerSettings({ numberOfPlayers, playersData }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const defaultColors = [
            "#FF5733", "#33FF57", "#3357FF", "#FF33A5",
            "#A533FF", "#FF8F33", "#33FFF5", "#ffef3f"
        ];

        const newPlayers = Array.from({ length: numberOfPlayers }, (_, index) => ({
            username: `Player${index + 1}`,
            color: defaultColors[index % defaultColors.length]
        }));

        setPlayers(newPlayers);
        playersData(newPlayers);
    }, [numberOfPlayers]);

    const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        playersData(players);
        toggleFormVisibility();
    };

    const handleUsernameChange = (index, newUsername) => {
        setPlayers(players.map((player, i) =>
            i === index ? { ...player, username: newUsername } : player
        ));
    };

    const handleColorChange = (index, newColor) => {
        setPlayers(players.map((player, i) =>
            i === index ? { ...player, color: newColor } : player
        ));
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <button
                onClick={toggleFormVisibility}
                className="w-full py-4 px-6 text-2xl font-bold text-yellow-300 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
                🎲 Player Settings
            </button>

            {isFormVisible && (
                <form onSubmit={handleFormSubmit} className="w-full mt-6 space-y-6">
                    {players.map((player, index) => (
                        <div
                            key={index}
                            className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-10 p-6 rounded-xl shadow-md space-y-4"
                        >
                            <div>
                                <label className="block text-lg font-semibold text-white mb-1">
                                    Username for Player {index + 1}
                                </label>
                                <input
                                    type="text"
                                    value={player.username}
                                    onChange={(e) => handleUsernameChange(index, e.target.value)}
                                    className="w-full px-4 py-2 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-semibold text-white mb-1">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={player.color}
                                    onChange={(e) => handleColorChange(index, e.target.value)}
                                    className="w-full h-16 cursor-pointer rounded-md border-none"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full py-3 text-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                    >
                        ✅ Save Settings
                    </button>
                </form>
            )}
        </div>
    );
}

export default PlayerSettings;
