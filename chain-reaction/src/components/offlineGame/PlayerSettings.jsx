import React, { useEffect, useState } from 'react';
// import "./PlayerSettings.css";

function PlayerSettings({ numberOfPlayers, playersData }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const defaultColors = [
            "#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#A533FF", "#FF8F33", "#33FFF5", "#ffef3f"
        ];

        // Initialize players with default usernames and unique colors when numberOfPlayers changes
        const newPlayers = Array.from({ length: numberOfPlayers }, (_, index) => ({
            username: `Player${index + 1}`,
            color: defaultColors[index % defaultColors.length] // Use colors in sequence, looping if needed
        }));
        setPlayers(newPlayers);
        playersData(newPlayers);
    }, [numberOfPlayers]);

    const toggleFormVisibility = () => setIsFormVisible(!isFormVisible);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // console.log("Player Settings:", players);
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
        <div className="flex flex-col items-center p-8 bg-[#E879F9] transform transition-all duration-300 hover:scale-105 rounded-2xl hover:brightness-110 shadow-xl w-full max-w-md mx-auto mt-10">
            <button
                onClick={toggleFormVisibility}
                className="w-full py-4 px-6 text-2xl font-bold text-[#7229E3] transform transition-all duration-300 hover:scale-105"
            >
                🎲 Player Settings
            </button>

            {isFormVisible && (
                // <div className="mt-8 w-full transform transition-all duration-300 hover:scale-105  p-8 rounded-2xl shadow-2xl">
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {players.map((player, index) => (
                            <div
                                key={index}
                                className="bg-purple-500 p-6 rounded-lg shadow-lg space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xl font-semibold text-lime-100">
                                        Username for Player {index + 1}:
                                    </label>
                                    <input
                                        type="text"
                                        value={player.username}
                                        onChange={(e) => handleUsernameChange(index, e.target.value)}
                                        className="w-full p-4 text-lg text-purple-900 bg-white rounded-lg border-2 border-amber-400 focus:outline-none focus:ring-4 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-lg font-semibold text-white">Color:</label>
                                    <input
                                        type="color"
                                        value={player.color}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                        className="w-full h-[10vh] p-3 bg-white rounded-lg border-2 border-amber-400 focus:outline-none focus:ring-4 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full py-4 text-2xl font-bold text-white bg-pink-fuchsia rounded-full shadow-lg hover:from-purple-400 hover:to-pink-300 transform transition-all duration-300 hover:scale-105"
                        >
                            Save Settings
                        </button>
                    </form>
                // </div>
            )}
        </div>
    );
}

export default PlayerSettings;
