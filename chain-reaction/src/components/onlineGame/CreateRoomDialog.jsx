import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSocket } from "../../contexts/SocketContext";

function CreateRoomDialog() {
    const socket = useSocket();
    const [roomCode, setRoomCode] = useState("");
    const [user, setUser] = useState(null);
    const apiURL = process.env.REACT_APP_API_URL;

    async function getRoomCode() {
        try {
            const result = await axios.get(`${apiURL}/getUserData`, {withCredentials: true});
            setUser(result.data);

            const response = await axios.post(`${apiURL}/createRoomCode`, null, {withCredentials: true});
            console.log(response.data);
            setRoomCode(response.data.roomCode);
        } catch (error) {
            console.log(error);
            // window.location.href = "/unauthorised";
        }
    }

    useEffect(() => {
        getRoomCode();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("wait-room-created", () => {
                window.location.href = `/online/waiting/${roomCode}`;
            });

            return () => {
                socket?.off("wait-room-created");
            };
        }
    }, [socket, roomCode]);

    function handleCreateRoom() {
        socket.emit("create-wait-room", roomCode, user);
    }

    return ( // 
        <div className="p-8 bg-fuchsia-500 text-white shadow-xl rounded-2xl w-full mx-auto text-center space-y-6 relative">
            {/* Overlay */}
            <div className="absolute inset-0 bg-pink-400 opacity-20 rounded-2xl pointer-events-none blur-xl"></div>
            <div className="relative z-10">
                <h2 className="text-2xl font-extrabold">Create Room</h2>
                <p className="text-lg my-4">
                    Room Code:{" "}
                    <span className="font-bold text-yellow-300">{roomCode}</span>
                </p>
                <button
                    onClick={handleCreateRoom}
                    className="my-4 bg-yellow-400 hover:bg-yellow-300 text-indigo-800 py-3 px-6 rounded-lg text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                    Create Room
                </button>
            </div>
        </div>
    );
}

export default CreateRoomDialog;
