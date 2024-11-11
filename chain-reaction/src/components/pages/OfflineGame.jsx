import React, {useEffect, useState} from "react";
import OfflineGameGrid from "../offlineGame/OfflineGameGrid";
import DropdownMenu from "../offlineGame/DropDown";
import PlayerSettings from "../offlineGame/PlayerSettings";
import GridSizeInput from "../offlineGame/GridSizeInput";
import axios from "axios";
import LoadGameDialog from "../offlineGame/LoadGameDialog";

// option to save offline matches too

function OfflineGame(){
    const [ready, setReady] = useState(false);
    const [numberOfPlayers, setNumberOfPlayers] = useState(2);
    const [playersData, setPlayersData] = useState(null);
    const [gridSize, setGridSize] = useState({rows: 12, cols: 6});
    const [gridData, setGridData] = useState({numberOfPlayers, playersData, gridSize});
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setGridData({playersData, gridSize, numberOfPlayers});
    }, [playersData, gridSize, numberOfPlayers]);

    useEffect(() => {
        async function fetchAuth(){
            try {
                const result = await axios.get("/auth/check");
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
        <div>
            {
                !ready ? (
                    <div>
                        <DropdownMenu onSelect={handleSelect}/>
                        <PlayerSettings numberOfPlayers={numberOfPlayers} playersData={setPlayersData} />
                        <GridSizeInput setGridSize={setGridSize} />
                        <button onClick={handleStart}>New Game</button>
                        {isAuthenticated && <LoadGameDialog loadGame={loadGame} />}
                    </ div>
                ) : (
                    <div>
                        <OfflineGameGrid gridData={gridData} authenticated={isAuthenticated} />
                    </div>
                )
            }
        </ div>
    )
}

export default OfflineGame;