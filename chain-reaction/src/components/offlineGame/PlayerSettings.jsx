import React, { useEffect, useState } from 'react';
import "./PlayerSettings.css";

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
        <div className="player-settings-container">
            <button onClick={toggleFormVisibility} className="player-settings-button">
                Player Settings
            </button>

            {isFormVisible && (
                <div className="settings-form">
                    <h2>Player Settings</h2>
                    <form onSubmit={handleFormSubmit}>
                        {players.map((player, index) => (
                            <div key={index} className="player-field">
                                <div>
                                    <label>
                                        Username for Player {index + 1}:
                                        <input 
                                            type="text" 
                                            value={player.username} 
                                            onChange={(e) => handleUsernameChange(index, e.target.value)}
                                            className="username-input"
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Color:
                                        <input 
                                            type="color" 
                                            value={player.color} 
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="color-picker"
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="form-submit-button">Save</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default PlayerSettings;
