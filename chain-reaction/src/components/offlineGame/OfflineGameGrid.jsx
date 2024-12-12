import React, { useState, memo, useMemo, useEffect } from "react";
import OneOrb from "../gameComponents/orbs/OneOrb";
import TwoOrbs from "../gameComponents/orbs/TwoOrbs";
import ThreeOrbs from "../gameComponents/orbs/ThreeOrbs";
import SaveGameDialog from "./SaveGameDialog";
import Leaderboard from "./LeaderBoard";
// import axios from "axios";


// store all the states (data) of the game in a gameState variable.. and save it in redis
// to continue the game from where it was left off

// const rows = 12;
// const cols = 6;

//get number of players and their user-names from user through main component

// for now lets assume these are the details of 4 players
// const players = [
//     {
//         index: 0,
//         name: "player1",
//         color: "#00FF40",
//         score: 0,
//         lost: false,
//         hasPlayed: false,
//     },
//     {
//         index: 1,
//         name: "player2",
//         color: "#2058FF",
//         score: 0,
//         lost: false,
//         hasPlayed: false,
//     },
//     {
//         index: 2,
//         name: "player3",
//         color: "#ff0000",
//         score: 0,
//         lost: false,
//     },
//     {
//         index: 3,
//         name: "player4",
//         color: "#ffff00",
//         score: 0,
//         lost: false,
//     },
// ];

function OfflineGameGrid({gridData, authenticated}){
    // constants for rendering game grid and creating players
    const {rows, cols} = useMemo(() => (gridData.gridSize), [gridData.gridSize]);
    const [players, setPlayers] = useState(() => 
        gridData.playersState || 
        gridData.playersData.map((player, index) => ({
            index: index,
            name: player.username,
            color: player.color,
            score: 0,
            lost: false,
            hasPlayed: false,
        }))
    );
    //     gridData.playersState || gridData.playersData.map((player, index) => ({
    //         index: index,
    //         name: player.username,
    //         color: player.color,
    //         score: 0,
    //         lost: false,
    //         hasPlayed: false
    //     })), [gridData.playersData]
    // );

    
    let [playerHasPlayed, setPlayerHasPlayed ]= useState(gridData.playerHasPlayed || Array.from({length: players.length}, () => false));
    const [isGameOver, setIsGameOver] = useState(false);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(gridData.currentPlayerIndex || 0);
    const [grid, setGrid] = useState(() => 
        gridData.gridState || Array.from({length: rows}, () => {
            return Array.from({length: cols}, () => ({orbs: 0, owner: null, explode: false}));
        })
    );

    const Cell = memo(({ rowIndex, colIndex, cell, currentPlayerIndex, players, handleCellClick }) => {
        const renderOrbs = (numberOfOrbs, ownerIndex) => {
            switch (numberOfOrbs) {
                case 1:
                    return <OneOrb color={players[ownerIndex]?.color} />;
                case 2:
                    return <TwoOrbs color={players[ownerIndex]?.color} />;
                case 3:
                    return <ThreeOrbs color={players[ownerIndex]?.color} />;
                default:
                    return null;
            }
        };

        return (
            <div
                key={`${rowIndex}-${colIndex}`}
                className="border p-1 text-center bg-gray-900 w-16 h-16 flex items-center justify-center relative transform transition-all duration-300 ease-in-out hover:scale-[1.1] hover:z-10"
                style={{
                    cursor: ((currentPlayerIndex === cell.owner) || cell.owner === null) && "pointer",
                    borderColor: players[currentPlayerIndex]?.color,
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
            >
                {renderOrbs(cell.orbs, cell.owner)}
            </div>
        );
    });

    function incrementScore(score){
        // ~~ how dumb can a person be ?? :) ~~
        
        // --------------- scoring system: --------------
        // cpatured an empty cell: 10pts
        // captured enemy's cell:  15tps
        // cell explodes:          5pts
        setPlayers(prevPlayers => 
            prevPlayers.map(player => 
                player.index === currentPlayerIndex 
                ? 
                    { ...player, score: player.score + score } 
                : 
                    player
            )
        );

        console.log(players)
    }

    async function handleCellClick(row, col) {
        if ((grid[row][col].owner === null || grid[row][col].owner === currentPlayerIndex) && !isGameOver) {

            grid[row][col].owner === null ? incrementScore(10) : incrementScore(5);
            
            let newGrid = grid.map((cellRow, rowIndex) => {
                return cellRow.map((cell, colIndex) => {
                    if (colIndex === col && rowIndex === row) {
                        return {
                            ...cell,
                            orbs: cell.orbs + 1,
                            owner: currentPlayerIndex
                        };
                    }
                    return cell;
                });
            });
            

            // Process explosions and wait until all are complete
            newGrid = await checkForExplosion(newGrid, row, col);
            setGrid(newGrid);

            // pass newGrid instead of grid as useState betrayed me
            checkIfPlayerLost(newGrid);
            setPlayerHasPlayed(prev => {
                return prev.map((player, index) => {
                    if(index === currentPlayerIndex){ return true }
                    return false;
                })
            })

            if (!isGameOver) {
                switchPlayers();
            }
        }
    }

    async function switchPlayers(){
        //switch to teh next player who hasn't lost yet
        setCurrentPlayerIndex((prev) => {
            let nextPlayerIndex = (prev + 1) % players.length;
            while (players[nextPlayerIndex].lost) {
                // playess..? i mean PLAYERS index start from 0 end at 6
                // 1 % 7 = 1 | 2 % 7 = 2 ... 7 % 7(players.length) = 0
                nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
            }
            return nextPlayerIndex;
        });

        // console.log(players);
    }

    function isValidCell(row, col){
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    function getCellCapacity(row, col){
        if((row === rows-1 || row === 0) && (col === cols-1 || col === 0)){
            return 2; // corner cells
        } else if ((row === 0 || row === rows-1 || col === 0 || col === cols-1)){
            return 3; // edge cells
        } else {
            return 4; // inside cells
        }
    }

    function checkIfPlayerLost(tempGrid){
        tempGrid = tempGrid === undefined ? grid : tempGrid;
        // console.log("checking");
        // waaaaaaaaaaaaaaaaaaaa i am dumb
        players.forEach((player) => {
            let playerHasOrbs = tempGrid.some(r => r.some(cell => 
                cell.owner === player.index && cell.orbs > 0
            ))
            console.log(player);
            if(!playerHasOrbs && playerHasPlayed[player.index]){
                console.log(playerHasPlayed, player.lost)
                player.lost = true;
            }
        })

        //get the numbers of players alive
        let numOfPlayersAlive = players.filter(player => !player.lost);

        // if number of players alive is 1.. then game over
        // that means u lost.. dumbhead
        if(numOfPlayersAlive.length === 1){
            setIsGameOver(true); // mata ashitha
            console.log(`${players.filter(p => p.lost).map(p => p.name)}`);
        }
    }

    async function wait(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function checkForExplosion(tempGrid, startRow, startCol) {
        const queue = [{ row: startRow, col: startCol }];
        const visited = new Set();
        // xplosion logic..
        // i wasted alot of my time on this crap
        // 2+ days T-T
        while (queue.length > 0) {
            checkIfPlayerLost(tempGrid);
            let currentLayer = [...queue];
            queue.length = 0;  // Reset for next layer
            
            for (const { row, col } of currentLayer) {
                const cellKey = `${row}-${col}`;
                if (visited.has(cellKey)) continue;
                visited.add(cellKey);
    
                const cell = tempGrid[row][col];
                const capacity = getCellCapacity(row, col);
    
                if (cell.orbs >= capacity) {
                    tempGrid = explodeCell(tempGrid, row, col, visited);
                    incrementScore(5);
                    // je deteste les voisins
                    const neighbors = [
                        { row: row - 1, col },
                        { row: row + 1, col },
                        { row, col: col + 1 },
                        { row, col: col - 1 },
                    ];
    
                    neighbors.forEach((neighbor) => {
                        if (isValidCell(neighbor.row, neighbor.col)) {
                            queue.push(neighbor);  // Add neighbors to the queue for the next layer
                        }
                    });
                }
            }
            // ye kya logic use kiya hai maine.. 
            // mereko sachi mai rona a raha hai ahhhhhuhhhhhhhhhh
            setGrid(tempGrid);  // Update grid state for each layer
            await wait(100);    // Pause between updating each layer
        }
    
        return tempGrid;
    }
    
    function explodeCell(tempGrid, row, col, visited) {
        let newGrid = tempGrid.map((r) => r.map((c) => ({ ...c })));  // Deep copy        // yahape bhi copy karne ke din aagaye XD

        newGrid[row][col] = {
            orbs: 0,
            owner: null,
            explode: true,
        };
    
        const neighbors = [
            { row: row - 1, col, position: "up" }, 
            { row: row + 1, col, position: "down" },
            { row, col: col + 1, position: "right" },
            { row, col: col - 1, position: "left" },
            // why positions?? coz u shithead tried something
            // which clearly didn't work
            // and u goldfish memory holder forgot to cleanup 🤦‍♂️
        ];
    
        neighbors.forEach((neighbor) => {
            if (isValidCell(neighbor.row, neighbor.col)) {
                // whyyyyyyyyyy doesnt states work T-T

                // and i return to say the same thing... 
                // why doesnt states freakin work T-T
                newGrid[row][col].owner != null ? incrementScore(15) : incrementScore(10);
                newGrid[neighbor.row][neighbor.col].orbs += 1;
                newGrid[neighbor.row][neighbor.col].owner = currentPlayerIndex;
                visited.delete(`${neighbor.row}-${neighbor.col}`);
            }
        });
    
        return newGrid;
    }

    function handleRestartGame(){
        setGrid(
            Array.from({length: rows}, () => {
                return Array.from({length: cols}, () => ({orbs: 0, owner: null, explode: false}));
            })
        )

        setIsGameOver(false);

        setPlayers(prev => (
            prev.map(player => (
                {
                    ...player,
                    lost: false,
                    hasPlayed: false,
                    score: 0,
                }
            ))
        ))

        // important ❗❗❗❗❗ this isnt resetting
        setPlayerHasPlayed(Array.from({ length: players.length }, () => false));

        setCurrentPlayerIndex(0);
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-6">
            {/* Leaderboard Section */}
            <Leaderboard players={players} gameOver={isGameOver} />
    
            {/* Game Status */}
            <div className="flex flex-col items-center p-4 space-y-6 text-center w-full max-w-3xl">
                {!isGameOver ? (
                    <p className="text-xl font-semibold text-teal-500 bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
                        Current player: <span className="text-blue-700">{players[currentPlayerIndex]?.name}</span>
                    </p>
                ) : (
                    <>
                        <p className="text-2xl font-bold text-green-600 bg-white px-8 py-4 rounded-lg shadow-lg border border-gray-300">
                            🎉 Congrats <span className="text-purple-700">{players[currentPlayerIndex]?.name}</span>! 🎉
                        </p>
                        <p className="text-md font-medium text-red-500 bg-white px-5 py-3 rounded-md shadow-sm border border-gray-200">
                            🤣 Shame on you {" "}
                            <span className="text-orange-600">
                                {players.filter(player => player.lost).map(p => p.name).join(", ")}
                            </span>
                        </p>
                    </>
                )}
            </div>
    
            {/* Game Grid */}
            <div
                className="grid mt-8 p-4 bg-white rounded-lg"
                style={{
                    maxWidth: `${cols * 4}rem`,
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            cell={cell}
                            currentPlayerIndex={currentPlayerIndex}
                            players={players}
                            handleCellClick={handleCellClick}
                        />
                    ))
                )}
            </div>
    
            {/* Save Game or Error */}
            <div className="mt-8">
                {authenticated ? (
                    <SaveGameDialog
                        currentPlayerIndex={currentPlayerIndex}
                        gridState={grid}
                        playersState={players}
                        playerHasPlayed={playerHasPlayed}
                        gameOver={isGameOver}
                        gridSize={{ rows, cols }}
                    />
                ) : (
                    <p className="text-lg font-semibold text-red-600 bg-white px-4 py-2 rounded-lg shadow-md">
                        Not logged in.. cannot save game
                    </p>
                )}
            </div>

            {isGameOver && 
                <button
                    onClick={handleRestartGame}
                    className="bg-red-500 mt-5 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Restart Game
                </button>
            }

        </div>
    );
    
}

export default OfflineGameGrid;

