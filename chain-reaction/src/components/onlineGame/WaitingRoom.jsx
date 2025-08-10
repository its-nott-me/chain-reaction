import React, { useEffect, useState } from "react";
import Header from "../headers/Header";
import { useParams } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import ChatSection from "./ChatSection";  // Import the ChatSection component
import axios from "axios";
import PlayerSettings from "./PlayerSetting";
import GridSizeInput from "./GridSizeInput";

function WaitingRoom() {
    const { roomCode } = useParams();
    const socket = useSocket();
    const [user, setUser] = useState(null);
    const [owner, setOwner] = useState(null);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState(false);
    const [gridSize, setGridSize] = useState({rows: 12, cols: 6});
    const [canEditInput, setCanEditInput] = useState(false);
    const [showAvatars, setShowAvatars] = useState(false); // To toggle avatar box
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const apiURL = process.env.REACT_APP_API_URL;

    const avatars = [
        "https://cdn-icons-png.flaticon.com/512/1752/1752691.png", // gastly
        "https://cdn-icons-png.flaticon.com/512/1752/1752772.png", // pikachu
        "https://cdn-icons-png.flaticon.com/512/1752/1752682.png", // duskull
        "https://cdn-icons-png.flaticon.com/512/188/188999.png", // zubat
        "https://cdn-icons-png.flaticon.com/512/188/188994.png", // mankey
        "https://cdn-icons-png.flaticon.com/512/1752/1752724.png", // marill
        "https://cdn-icons-png.flaticon.com/512/1752/1752767.png", // phanpy
        "https://cdn-icons-png.flaticon.com/512/1752/1752813.png", // snorlax
        "https://cdn-icons-png.flaticon.com/512/1752/1752735.png", // meowth,
        "https://cdn-icons-png.flaticon.com/512/1752/1752713.png", // jigglypuff
        "https://cdn-icons-png.flaticon.com/512/1752/1752660.png", // castform
        "https://cdn-icons-png.flaticon.com/512/1752/1752636.png", // bellsprout
        "https://cdn-icons-png.flaticon.com/512/1752/1752640.png", // breloom
        "https://cdn-icons-png.flaticon.com/256/1752/1752655.png", // cacnea
        "https://cdn-icons-png.flaticon.com/256/1752/1752791.png", // rosalia
        "https://cdn-icons-png.flaticon.com/256/1752/1752828.png", // starmie
        "https://cdn-icons-png.flaticon.com/256/1752/1752678.png", // diglett
        "https://cdn-icons-png.flaticon.com/256/1752/1752875.png", // voltorb
        "https://cdn-icons-png.flaticon.com/256/1752/1752835.png", // sudowoodo
        "https://cdn-icons-png.flaticon.com/256/1752/1752780.png", // poliwhirl
        "https://cdn-icons-png.flaticon.com/256/1752/1752890.png", // wingull
        "https://cdn-icons-png.flaticon.com/256/1752/1752719.png", // magnemite
        "https://cdn-icons-png.flaticon.com/256/1752/1752707.png", // hoothoot
        "https://cdn-icons-png.flaticon.com/256/1752/1752633.png", // aron
        "https://cdn-icons-png.flaticon.com/256/1752/1752867.png", // teddy ursa
        "https://cdn-icons-png.flaticon.com/256/1752/1752687.png", // exeggutor
        "https://cdn-icons-png.flaticon.com/256/1752/1752681.png", // ditto,
        "https://cdn-icons-png.flaticon.com/256/1752/1752846.png", // swabblu
        "https://cdn-icons-png.flaticon.com/256/1752/1752716.png", // ladyba
        
        // ---------------- i choose you --------------
        
        "https://cdn-icons-png.flaticon.com/256/1752/1752783.png", // gladion ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752822.png", // GS ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752776.png", // poke ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752871.png", // ultra ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752763.png", // park ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752738.png", // nest ball
        "https://cdn-icons-png.flaticon.com/256/1752/1752705.png", // heavy ball
        // Add more avatar URLs here...
    ];

    const token = localStorage.getItem("token");

    async function getUser() {
        try{
            const response = await axios.get(`${apiURL}/getUserData`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(response.data);
            setUser(response.data);
        }  catch (error) {
            window.location.href = "/unauthorised";
        }
    }

    async function getOwner(){
        try{
            const response = await axios.get(`${apiURL}/getOwnerData/${roomCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        console.log(response.data);
        setOwner(response.data);
        return response.data;
        } catch (error) {
            window.location.href = "/unauthorised";
        }
    }

    async function getGridSize(){
        const response = await axios.get(`${apiURL}/waiting/gridSize/${roomCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        setGridSize(response.data);
    }

    useEffect(() => {
        getUser();
        getOwner();
        getGridSize();
    }, [])

    useEffect(() => {
        if (socket) {
            socket.emit("join-wait-room", roomCode);

            socket.on("owner-updated", (updatedOwner) => {
                console.log(updatedOwner);
                setOwner(updatedOwner);
            });

            socket.on("game-started", async () => {
                console.log("owner: ", owner);
                let response = await getOwner();
                console.log(response)
                window.location.href=`/online/game/${owner?.userId || response.userId}`;
            });

            socket.on("grid-size-updated", (updatedGridSize) => {
                if (gridSize !== updatedGridSize) { setGridSize(updatedGridSize) };
                console.log(updatedGridSize)
            })

            return () => {
                socket.off("join-wait-room");
                socket.off("owner-updated");
                socket.off("start-game");
                socket.off("game-started");
                socket.off("update-grid-size");
                socket.off("grid-size-updated");
                socket.off("leave-waiting-room");
            };
        }
    }, [socket, roomCode]);

    useEffect(() => {
        if(socket){
            (owner?.email === user.email) && socket.emit("update-grid-size", roomCode, gridSize);
        }
    }, [gridSize]);

    useEffect(() => {
        if(user && owner){
            setCanEditInput(user.email === owner.email);
        }
    }, [user, owner]);

    useEffect(() => {
        console.log(players)
        if(players.length+1 >= 2) {setError(false)}
        else {setError(true)}
    }, [players]);

    function handleStartGame(){
        if(socket){
            socket.emit("start-game", roomCode, gridSize, players);
        }
    }

    function handleLeaveGame(){
        let player = {
            email: user.email,
            roomCode
        }
        socket.emit("leave-waiting-room", player);
        window.location.href = "/online";
    }

    function handleSelectAvatar(index){
        setSelectedAvatar(avatars[index]);
        socket.emit("update-avatar", avatars[index], user.userId);
    }

    if(!user || !owner) {return};

    return (
        <div className="h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 flex flex-col">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 z-0 grid grid-cols-12 gap-4 opacity-20 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className={`w-6 h-6 rounded-full animate-glowPulse ${['bg-pink-200', 'bg-yellow-200', 'bg-purple-200'][Math.floor(Math.random() * 3)]}`}
                    style={{
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 4 + 3}s`,
                    }}
                ></div>
                ))}
            </div>

            {/* Floating Orbs */}
            <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className="w-10 h-10 bg-yellow-400 rounded-full animate-bounceOrb shadow-xl"
                    style={{
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 2 + 2}s`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    position: "absolute",
                    }}
                ></div>
                ))}
            </div>
            <Header />
            <div className="flex flex-1 flex-wrap lg:flex-nowrap">
                {/* Chat Section */}
                <div className="lg:max-h-[90vh] chat-section bg-gray-800 text-white p-4 flex-grow lg:w-2/3 order-2 lg:order-1">
                    <ChatSection user={user} />
                </div>

                {/* Settings Section */}
                <div className="settings overflow-y-auto lg:max-h-[90vh] scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200 bg-game-gradient bg-gray-200 p-6 w-full lg:w-1/3 flex-shrink-0 order-1 lg:order-2">
                <p className="text-xl font-bold mb-4 text-amber-200 rounded-md px-4 py-2 ">
                    Room code: {roomCode}
                </p>

                    {/* Game Controls */}
                    <div className="mb-6 flex justify-center gap-6">
                        {owner.email === user.email && (
                            <button
                                className={`bg-gradient-to-r from-emerald-500 to-emerald-600 brightness-125 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded shadow-md transition duration-200 w-1/4 lg:w-1/2 ${
                                    error ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                }`}
                                onClick={handleStartGame}
                                disabled={error}
                            >
                                Start Game
                            </button>
                        )}
                        {owner.email === user.email && error && (
                            <p className="text-[#FFC95A] font-bold self-center text-xl mt-2">Need more than 1 player to start the game</p>
                        )}
                        <button
                            className="bg-gradient-to-r from-red-500 to-red-600 w-1/4 hover:bg-red-600 text-white font-bold py-2 px-4 mt-4 rounded shadow-md transition duration-200 lg:w-1/2"
                            onClick={handleLeaveGame}
                        >
                            Leave Room
                        </button>
                    </div>

                    {/* Avatar Selector */}
                    <div>
                        <button
                            type="button"
                            // uh ehhhhhhhhh change the colors later.. the other 2 buttons too.. thanks
                            className="px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            onClick={() => setShowAvatars(!showAvatars)}
                        >
                            {showAvatars ? "Hide Avatars" : "Change Avatar"}
                        </button>
                        {showAvatars && (
                            <div className="p-4 mt-4 border border-gray-300 rounded-lg">
                                <p className="mb-2 text-center text-gray-600">Select Your Avatar</p>
                                <div className="grid grid-cols-4 gap-4">
                                    {avatars.map((avatar, index) => (
                                        <img
                                            key={index}
                                            src={avatar}
                                            alt={`Avatar ${index}`}
                                            onClick={() => handleSelectAvatar(index)}
                                            className={`w-16 h-16 rounded-full bg-white cursor-pointer border-2 ${
                                                selectedAvatar === avatar ? "border-blue-500" : "border-transparent"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Additional Settings */}
                    <div className="mt-4">
                        <PlayerSettings user={user} roomCode={roomCode} playersData={{ players, setPlayers }} />
                    </div>
                    <div className="mt-4">
                        <GridSizeInput gridSizeData={{ setGridSize, gridSize }} canEditInput={canEditInput} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WaitingRoom;
