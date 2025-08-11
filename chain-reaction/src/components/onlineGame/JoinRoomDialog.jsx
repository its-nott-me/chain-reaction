import React, { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

function JoinRoomDialog() {
    const [roomCode, setRoomCode] = useState("");
    const socket = useSocket();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            const onWaitRoomJoined = () => {
                navigate(`/online/waiting/${roomCode}`);
            };

            const onInvalidRoomCode = () => {
                setError("Invalid room code. Please try again!");
            };

            const onWaitRoomFull = () => {
                setError("Room full! Please try another room.");
            };

            socket.on("wait-room-joined", onWaitRoomJoined);
            socket.on("invalid-room-code", onInvalidRoomCode);
            socket.on("wait-room-full", onWaitRoomFull);

            // Cleanup function
            return () => {
                socket.off("wait-room-joined", onWaitRoomJoined);
                socket.off("invalid-room-code", onInvalidRoomCode);
                socket.off("wait-room-full", onWaitRoomFull);
            };
        }
    }, [socket, roomCode]);

    const handleJoinRoom = () => {
        if (roomCode.trim().length === 6) {
            socket.emit("join-wait-room", roomCode);
            setError(null);
        } else {
            setError("Room code must be 6 characters.");
        }
    };

    const handleInputChange = (event) => {
        const inputCode = event.target.value;
        if (inputCode.length <= 6) {
            setRoomCode(inputCode);
            setError(null);
        }
    };

    return (
        <div className="p-8 bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-xl rounded-2xl max-w-sm mx-auto text-center space-y-6 relative">
            <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-2xl pointer-events-none blur-xl"></div>
            <div className="relative z-10">
                <h2 className="text-2xl font-extrabold">Join Room</h2>
                <p className="text-lg my-4">Enter a 6-character Room Code:</p>
                <input
                    type="text"
                    value={roomCode}
                    onChange={handleInputChange}
                    placeholder="Enter Room Code"
                    className="border-2 border-white bg-white text-gray-800 rounded-lg p-3 text-center w-full font-semibold text-lg shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-300"
                    maxLength="6"
                />
                <button
                    onClick={handleJoinRoom}
                    className="bg-yellow-400 mt-5 hover:bg-yellow-300 text-indigo-800 py-3 px-6 rounded-lg text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                    Join Room
                </button>
                {error && (
                    <p className="text-sm text-red-400 font-semibold mt-2">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default JoinRoomDialog;