import React, { useEffect, useState } from 'react';
import { useSocket } from "../../contexts/SocketContext"; // Import the socket context
import PlayersGrid from './PlayersGrid';

function PlayerSettings({ user, roomCode, playersData }) {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#A533FF", "#FF8F33", "#33FFF5", "#ffef3f"];
    const [player, setPlayer] = useState({ username: user?.username, color: colors[0], roomCode, email: user.email });
    const socket = useSocket(); // Get the socket from the context

    useEffect(() => {
        if (socket) {
            socket.emit("size-wait-room", roomCode);
            socket.emit("new-player", { ...player, userId: user.userId });
            socket.on("wait-room-size", (size) => {
                setPlayer(prev => ({
                    ...prev,
                    color: colors[size - 1]
                }));
            });

            window.addEventListener("beforeunload", () => socket.emit("leave-waiting-room", player));

            return () => {
                window.removeEventListener("beforeunload", () => socket.emit("leave-waiting-room", player));
                socket.off("size-wait-room");
                socket.off("leave-waiting-room");
                socket.off("wait-room-size");
                socket.off("update-player-settings");
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.emit('update-player-settings', player);
        }
    }, [player.color, player.username]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (socket) {
            // console.log(player);
            socket.emit('update-player-settings', player);
        }
    };

    const handleUsernameChange = (newUsername) => {
        setPlayer({ ...player, username: newUsername });
    };

    const handleColorChange = (newColor) => {
        setPlayer({ ...player, color: newColor });
    };

    return (
        <div className="player-settings-container rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row gap-8">
            
            {/* Form Section */}
            <div className="settings-form z-10 flex-grow bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Player Settings</h2>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="player-field flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={player.username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            className="p-3 border rounded-lg text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your username"
                        />
                    </div>
                    {/* Color Picker */}
                    <div className="color-picker flex items-center gap-4">
                        <label className="text-sm font-semibold text-gray-700">
                            Color
                        </label>
                        <input
                            type="color"
                            value={player.color}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-14 h-12 border-2 border-gray-300 rounded-lg cursor-pointer shadow focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    {/* Save Button */}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md w-full sm:w-auto"
                    >
                        Save Settings
                    </button>
                </form>
            </div>

            {/* Players List */}
            <PlayersGrid roomCode={roomCode} user={user} playersData={playersData} />
        </div>
    );
}

export default PlayerSettings;
