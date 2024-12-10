import React from "react";
import Header from "../headers/Header";
import CreateRoomDialog from "../onlineGame/CreateRoomDialog"; 
import JoinRoomDialog from "../onlineGame/JoinRoomDialog";

function CreateOrJoinRoom() {
    return ( //bg-gradient-to-r from-blue-300 via-teal-400 to-purple-500
        // bg-gradient-to-r from-purple-500 via-pink-400 to-red-500
        <div className="min-h-screen bg-game-gradient text-white flex flex-col items-center relative overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 z-0 grid grid-cols-12 gap-4 opacity-20">
                {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="w-6 h-6 bg-blue-500 rounded-full animate-glowPulse"
                    style={{
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 4 + 3}s`,
                    }}
                ></div>
                ))}
            </div>

            {/* Randomly Moving Balls */}
            <div className="absolute inset-0 z-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="w-8 h-8 bg-yellow-500 rounded-full animate-bounceOrb shadow-lg"
                        style={{
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${Math.random() * 5 + 3}s`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            position: "absolute",
                        }}
                    ></div>
                ))}
            </div>

            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="z-10 mt-10 w-full max-w-2xl space-y-8 text-center">
                <h1 className="text-3xl font-bold text-white tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-red-400">
                    Create or Join a Room
                </h1>
                <p className="text-lg text-gray-200">
                    Choose whether to start a new game or join an existing one!
                </p>

                {/* Create and Join Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-fuchsia-400 flex text-lg font-semibold py-4 px-8 rounded-xl shadow-md transition-transform transform hover:scale-110">
                        <CreateRoomDialog />
                    </div>
                    <div className="bg-green-500 flex text-lg font-semibold py-4 px-8 rounded-xl shadow-md transition-transform transform hover:scale-110">
                        <JoinRoomDialog />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateOrJoinRoom;
