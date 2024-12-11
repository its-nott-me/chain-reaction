import React, {useEffect, useState} from "react";
import OfflineGameGrid from "../offlineGame/OfflineGameGrid";
import DropdownMenu from "../offlineGame/DropDown";
import PlayerSettings from "../offlineGame/PlayerSettings";
import GridSizeInput from "../offlineGame/GridSizeInput";
import axios from "axios";
import LoadGameDialog from "../offlineGame/LoadGameDialog";
import Header from "../headers/Header";

// option to save offline matches too

function OfflineGame(){
    const [ready, setReady] = useState(false);
    const [numberOfPlayers, setNumberOfPlayers] = useState(2);
    const [playersData, setPlayersData] = useState(null);
    const [gridSize, setGridSize] = useState({rows: 12, cols: 6});
    const [gridData, setGridData] = useState({numberOfPlayers, playersData, gridSize});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const apiURL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        setGridData({playersData, gridSize, numberOfPlayers});
    }, [playersData, gridSize, numberOfPlayers]);

    useEffect(() => {
        async function fetchAuth(){
            try {
                const result = await axios.get(`${apiURL}/auth/check`);
                setIsAuthenticated(result.data === true); // Ensures it’s a boolean
                console.log("Auth Status from server:", result.data); // Log exact response
            } catch (err) {
                console.error("Error checking if authenticated:", err);
            }
        };
        fetchAuth();
    }, []);
    
    function loadGame(data){
        setGridData({ ...data });
        setReady(true);
    }

    function handleSelect(num){
        setNumberOfPlayers(num);
    }

    function handleStart(){
        setReady(true);
    }
    return(
<div className="min-h-screen bg-game-gradient flex flex-col items-center pb-6 relative overflow-hidden">
    {/* Animated Grid Background */}
    <div className="fixed inset-0 z-0 grid grid-cols-12 gap-4 opacity-20 pointer-events-none">
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
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
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

    {/* Fixed Header */}
    <Header className="fixed top-0 left-0 z-10 w-full shadow-lg" />

    {/* Main Content */}
    <div className="w-full flex justify-center z-10 items-center flex-col space-y-8 mt-10">
        {!ready ? (
            <div className="p-6 w-full max-w-3xl space-y-6">
                <h1 className="text-4xl font-bold text-center text-amber-200 tracking-widest">
                    Setup Your Game
                </h1>
                <div className="space-y-4">
                    <DropdownMenu onSelect={handleSelect} />
                    <PlayerSettings numberOfPlayers={numberOfPlayers} playersData={setPlayersData} />
                    <GridSizeInput setGridSize={setGridSize} />
                </div>
                <div className="flex justify-between items-center space-x-4">
                    <button
                        onClick={handleStart}
                        className="px-4 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:scale-[1.1] transform transition-all duration-300 ease-in-out"
                    >
                        Start New Game
                    </button>
                    {isAuthenticated && (
                        <LoadGameDialog loadGame={loadGame} />
                    )}
                </div>
            </div>
        ) : (
            <div className="w-full z-10 max-w-5xl rounded-lg ">
                <OfflineGameGrid gridData={gridData} authenticated={isAuthenticated} />
            </div>
        )}
    </div>
</div>

    )
}

export default OfflineGame;