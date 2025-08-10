import React, { useState, useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useParams } from "react-router-dom";
import axios from "axios";

function ChatSection({ user }) {
    let { roomCode } = useParams();
    let { roomId } = useParams();
    if (!roomCode && roomId) {
        roomCode = roomId;
    }
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const apiURL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (socket) {
            // Listen for incoming messages and update the message list
            socket.on("new-message", (message) => {
                message = { ...message, timestamp: Date.now() };
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            // Fetch previous messages when component mounts
            axios
                .get(`${apiURL}/messages/${roomCode}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setMessages(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching messages:", error);
                });

            // Cleanup on component unmount
            return () => {
                socket.off("new-message");
            };
        }
    }, [socket, roomCode]); // Ensure dependencies are correct

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    }

    const handleSendMessage = () => {
        if (message.trim()) {
            const messageData = {
                roomCode,
                sender: {
                    username: user.username,
                    avatar: user.avatar,
                },
                message: message,
            };

            socket.emit("send-message", messageData, user.email);

            // Update local message list temporarily (optimistic UI update)
            setMessages((prevMessages) => [
                ...prevMessages,
                { ...messageData, timestamp: Date.now() },
            ]);

            setMessage("");
        }
    };

    return (
        <div className="chat-section bg-gray-100 border-r shadow-lg flex flex-col h-full lg:w-3/10 w-full lg:min-h-0 min-h-[700px]">
            <div className="messages flex-1 overflow-y-scroll p-4 space-y-4 bg-gray-50 max-h-[90vh] scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message flex items-center justify-between p-2 rounded-lg ${
                            msg.sender.username === user.username
                                ? "bg-blue-100 self-end"
                                : "bg-gray-200"
                        }`}
                    >
                        <div className="flex items-start space-x-3">
                            <img
                                src={msg.sender.avatar}
                                alt={msg.sender.username}
                                className="w-10 h-10 rounded-full bg-white border"
                            />
                            <div className="message-content">
                                <p className="font-semibold text-blue-700 text-left">{msg.sender.username}</p>
                                <p className="text-gray-700 text-left">{msg.message}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                ))}
            </div>

            <div className="input-section flex items-center p-3 bg-white border-t">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border text-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatSection;