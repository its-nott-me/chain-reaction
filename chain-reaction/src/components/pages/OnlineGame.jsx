import React, { useEffect, useState } from "react";
import Header from "../headers/Header";
import { useParams } from "react-router-dom";
import OnlineGameGrid from "../onlineGame/gridComponents/OnlineGameGrid";
import axios from "axios";
import ChatSection from "../onlineGame/ChatSection";
import LostGameDialog from "../onlineGame/gridComponents/LostGameDialog";
import { useSocket } from "../../contexts/SocketContext";
import WinGameDialog from "../onlineGame/gridComponents/WinGameDialog";

function OnlineGame() {
    const { roomId } = useParams(); // room Id is owner.userId
    const [gridData, setGridData] = useState();
    const [user, setUser] = useState();
    const [isLostDialogOpen, setIsLostDialogOpen] = useState(false);
    const [isWinDialogOpen, setIsWinDialogOpen] = useState(false);
    const socket = useSocket();
    const apiURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (socket) {
            socket.on("wait-room-created", (roomCode) => {
                socket.emit("restart-game", roomId, roomCode);
                window.location.href = `/online/waiting/${roomCode}`;
            });

            socket.on("game-restarted", (roomCode) => {
                window.location.href = `/online/waiting/${roomCode}`;
            })

            return () => {
                socket.off("wait-room-created");
                socket.off("create-wait-room")
                socket.off("restart-game");
                socket.off("game-restarted");
            };
        }
    }, [socket]);

    const handleLoseGame = () => {
        setIsLostDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsLostDialogOpen(false);
    };

    const handleWinGame = () => {
        setIsWinDialogOpen(true);
    };

    const handleCloseWinDialog = () => {
        setIsWinDialogOpen(false);
    };

    const handleRestartGame = async () => {
        const response = await axios.post(`${apiURL}/createRoomCode`);
        const waitingRoomCode = response.data.roomCode;
        console.log(waitingRoomCode);

        socket.emit("create-wait-room", waitingRoomCode, user);
        setIsWinDialogOpen(false);
    };

    async function getOnlineGameStateData() {
        const response = await axios.get(`${apiURL}/online/gameState/${roomId}`);
        console.log(response.data);
        if(!response.data){window.location.href = "/unauthorised";}
        setGridData(response.data);
    }

    async function getUser() {
        try{
            const response = await axios.get(`${apiURL}/getUserData`);
            setUser(response.data);
            console.log(response.data);
        } catch (error) {
            if(error.status === 401){
                window.location.href = "/unauthorised";
            }
        }
    }

    useEffect(() => {
        getOnlineGameStateData();
        getUser();
    }, []);

    if (!gridData || !user) {
        return null;
    }

    return (
        <>
            {/* Fixed Header */}
            <Header />
            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row  w-full" >
                {/* Online Game Grid */}
                <div className="lg:w-7/10 w-full flex justify-center items-center gap-8">
                    <OnlineGameGrid
                        gridData={gridData}
                        roomId={roomId}
                        user={user.userId}
                        handleLoseGame={handleLoseGame}
                        handleWinGame={handleWinGame}
                    />
                </div>

                {/* Chat Section */}
                <div className="lg:w-3/10 w-full bg-gray-700 overflow-auto flex flex-col p-4">
                    <ChatSection user={user} />
                </div>

                {/* Dialogs */}
                <LostGameDialog
                    isOpen={isLostDialogOpen}
                    onClose={handleCloseDialog}
                />
                <WinGameDialog
                    isOpen={isWinDialogOpen}
                    onClose={handleCloseWinDialog}
                    onRestart={handleRestartGame}
                />
            </div>
        </>
    );
}

export default OnlineGame;
