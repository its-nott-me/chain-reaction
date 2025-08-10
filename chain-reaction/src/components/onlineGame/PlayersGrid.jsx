import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from "../../contexts/SocketContext";


const PlayersGrid = ({ roomCode, user, playersData }) => {
    const {players, setPlayers} = playersData; // Array of players with color and username
    // const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A5", "#A533FF", "#FF8F33", "#33FFF5", "#ffef3f"];
    const socket = useSocket(); // Socket instance from context
    const apiURL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    // Function to add or update a player, avoiding duplicates
    const addOrUpdatePlayer = (newPlayer) => {
        console.log(newPlayer)
        setPlayers((prevPlayers) => {
            // Check if the player already exists in the current state
            if(user.email === newPlayer.email){ return prevPlayers };
            const playerExists = prevPlayers.some((player) => player.email === newPlayer.email);

            if (playerExists) {
                // Update the existing player's data
                return prevPlayers.map((player) =>
                    player.email === newPlayer.email ? newPlayer : player
                );
            } else {
                // Add the new player if they don't already exist
                return [...prevPlayers, newPlayer];
            }
        });
    };

    // Fetch players data when the component mounts
    useEffect(() => {
        if (!socket) return;

        // Fetch initial player data and ensure no duplicates
        axios
            .get(`${apiURL}/waiting/players/${roomCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then((response) => {
                const fetchedPlayers = response.data;

                // Deduplicate initial fetch
                const uniquePlayers = fetchedPlayers.filter((player, index, self) =>
                    index === self.findIndex((p) => (p.email === player.email) && (p.email != user.email))
                );

                // Initialize state with unique players only
                setPlayers(uniquePlayers);
            })
            .catch((error) => {
                console.error("Error fetching players:", error);
            });

        // Listen for player updates via socket
        socket.on("player-added", (newPlayer) => {
            addOrUpdatePlayer(newPlayer);
        });

        socket.on("waiting-room-left", (email) => {
            setPlayers((prevPlayers) => {
                return prevPlayers.filter((player) => player.email !== email);
            });
        });

        socket.on("player-settings-updated", (updatedPlayer) => {
            addOrUpdatePlayer(updatedPlayer);
        });

        return () => {
            socket.off("player-added");
            socket.off("waiting-room-left");
            socket.off("player-settings-updated");
        };
    }, [socket, roomCode]);

    return (
        <div className="z-10 bg-gray-50 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Players in the Room</h2>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] gap-6">
                {players.map((player, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center rounded-lg shadow-md text-white font-semibold p-4 transition-transform transform hover:scale-105"
                        style={{
                            backgroundColor: player.color,
                            height: "120px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <div className="text-sm font-semibold text-white truncate w-full text-center mt-2 px-3 py-2 rounded-md bg-black bg-opacity-25 shadow-md transition-all duration-300 transform hover:bg-opacity-70">
                            {player.username}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayersGrid;
