import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSocket } from "../../contexts/SocketContext";
import useNavigate from "react-router-dom";

function CreateRoomDialog() {
  const socket = useSocket();
  const [roomCode, setRoomCode] = useState("");
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${apiURL}/getUserData`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(result.data);

        const response = await axios.post(`${apiURL}/createRoomCode`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoomCode(response.data.roomCode);
      } catch (error) {
        console.error(error);
        navigate("/unauthorised");
      }
    }

    fetchData();
  }, [apiURL]);

  useEffect(() => {
    if (socket) {
      socket.on("wait-room-created", () => {
         navigate(`/online/waiting/${roomCode}`);
      });
      return () => socket.off("wait-room-created");
    }
  }, [socket, roomCode]);

  function handleCreateRoom() {
    if (roomCode && user) {
      socket.emit("create-wait-room", roomCode, user);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // hide after 1.5 seconds
  }

  return (
    <div className="p-8 bg-fuchsia-500 text-white shadow-xl rounded-2xl w-full mx-auto text-center space-y-6 relative">
      <div className="absolute inset-0 bg-pink-400 opacity-20 rounded-2xl pointer-events-none blur-xl"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-extrabold">Create Room</h2>
        <p className="text-lg my-4 flex items-center justify-center gap-2">
          Room Code:{" "}
          <span className="font-bold text-yellow-300">{roomCode}</span>
          <button
            onClick={handleCopy}
            className="text-yellow-200 hover:text-yellow-100 text-sm transition-colors"
            title="Copy to clipboard"
          >
            📋
          </button>
        </p>
        <button
          onClick={handleCreateRoom}
          className="my-4 bg-yellow-400 hover:bg-yellow-300 text-indigo-800 py-3 px-6 rounded-lg text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Create Room
        </button>
      </div>

        {/* Small toast notification */}
        {copied && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm shadow-md animate-fadeIn">
            Copied!
            </div>
        )}
    </div>
  );
}

export default CreateRoomDialog;
