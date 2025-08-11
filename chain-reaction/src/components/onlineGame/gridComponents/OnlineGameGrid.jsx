import React, { useState, memo, useMemo, useEffect } from "react";
import OneOrb from "../../gameComponents/orbs/OneOrb"
import TwoOrbs from "../../gameComponents/orbs/TwoOrbs";
import ThreeOrbs from "../../gameComponents/orbs/ThreeOrbs";
import Leaderboard from "./LeaderBoard";
import { useSocket } from "../../../contexts/SocketContext";

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

function OnlineGameGrid({gridData, roomId, user, handleLoseGame, handleWinGame}){ // user variable contains only userID
    // constants for rendering game grid and creating players
    // console.log(gridData)
    const {rows, cols} = useMemo(() => (gridData.gridSize), [gridData.gridSize]);
    const [players, setPlayers] = useState(gridData.players);

    let playerHasPlayed = useMemo(() => gridData.playerHasPlayed || Array.from({length: players.length}, () => false), [gridData.playersData]);
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
                className={`relative bg-gray-900 w-16 h-16 border-[1px] flex items-center justify-center transition-transform transform  ${
                    players[currentPlayerIndex].id === user &&
                    (cell.owner === null || cell.owner === currentPlayerIndex)
                        ? "hover:scale-[1.15] hover:z-10 hover:shadow-md hover:border-yellow-400 cursor-pointer"
                        : "cursor-not-allowed "
                }`}
                style={{
                    borderColor: players[currentPlayerIndex].color,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle depth effect
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
            >
                <div
                    className="absolute inset-0 w-full h-full rounded-md bg-opacity-10 pointer-events-none"
                />
                {renderOrbs(cell.orbs, cell.owner)} {/* Render the orb component */}
            </div>
        );
    });

    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit("join-game-room", roomId);
    
            socket.on("players-switched", (nextPlayerIndex) => {
                setCurrentPlayerIndex(nextPlayerIndex);
                // console.log(nextPlayerIndex);
            });
    
            socket.on("orb-added", async (playerIndex, row, col, orbs) => {
                // Use functional update to ensure you're working with the latest state
                setGrid((prevGrid) => {
                    // Create a new grid reference based on the previous state
                    let newGrid = prevGrid.map((cellRow, rowIndex) => {
                        return cellRow.map((cell, colIndex) => {
                            if (colIndex === col && rowIndex === row) {
                                return {
                                    ...cell,
                                    orbs: orbs,
                                    owner: playerIndex,
                                };
                            }
                            return cell;
                        });
                    });
    
                    // Process explosions and wait until all explosions are complete
                    // Use async function to handle explosion in a clean way
                    (async () => {
                        newGrid = await checkForExplosion(newGrid, row, col, playerIndex);
                        setGrid(newGrid); // Update state with the new grid
                    })();
    
                    return newGrid; // Return the updated grid state
                });
    
                // Update player play status outside of setGrid
                playerHasPlayed[playerIndex] = true;
            });

            socket.on("score-incremented", (score, playerIndex) => {
                setPlayers(prev => {
                    const updatedPlayers = prev.map(player => {
                        if(player.index === playerIndex){
                            // console.log("points: ", score);
                            return {
                                ...player,
                                score: player.score + (score/2)
                            }
                        }
                        return player
                    })
                    return updatedPlayers;
                })
            });

            socket.on("lost-player", (playerIndex) => {
                setPlayers((prev) => (
                    prev.map((player) => {
                        if(player.index === playerIndex){
                            return {
                                ...player,
                                lost:true,
                            }
                        }
                        return player
                    })
                ))
            });
    
            return () => {
                socket.off("join-game-room")
                socket.off("switch-players");
                socket.off("add-orb");
                socket.off("orb-added");
                socket.emit("leave-game-room", roomId); // user contains userId and nthn else
            };
        }
    }, [socket]);

    if(!socket) {return};

    function incrementScore(score, playerIndex){
        // ~~ how dumb can a person be ?? :) ~~
        // console.log("score: ",score);
        // --------------- scoring system: --------------
        // cpatured an empty cell: 10pts
        // captured enemy's cell:  15tps
        // cell explodes:          5pts

        // setPlayers(prevPlayers => 
        //     prevPlayers.map(player => 
        //         player.index === playerIndex 
        //         ? 
        //             { ...player, score: player.score + score } 
        //         : 
        //             player
        //     )
        // );

        socket.emit("increment-score", score, playerIndex, roomId);

        // players.map(player => 
        //     player.index === currentPlayerIndex 
        //     ? 
        //         { ...player, score: player.score + score } 
        //     : 
        //         player
        // )

        // console.log(players)
    }

    // ig nothing to change here
    async function handleCellClick(row, col) {
        if (
            (grid[row][col].owner === null || grid[row][col].owner === currentPlayerIndex) && // cell should be empty or urs
            !isGameOver &&  // some idiot shouldn't have won
            gridData.players[currentPlayerIndex].id === user // u r who u r
        ) {
            // console.log("clicked");

            grid[row][col].owner === null ? incrementScore(10, currentPlayerIndex) : incrementScore(5, currentPlayerIndex);
            socket.emit("add-orb", currentPlayerIndex, row, col, grid[row][col].orbs + 1, roomId);
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
            

            // Process explosions and wait until all xplosions are complete
            newGrid = await checkForExplosion(newGrid, row, col, currentPlayerIndex);
            setGrid(newGrid);

            // pass newGrid instead of grid as useState betrayed me
            checkIfPlayerLost(newGrid);
            playerHasPlayed[currentPlayerIndex] = true;

            if (!isGameOver) {
                switchPlayers();
            }
        }
    }

    async function switchPlayers(){
        //switch to teh next player who hasn't lost yet
        let nextPlayerIndex;
        setCurrentPlayerIndex((prev) => {
            nextPlayerIndex = (prev + 1) % players.length;
            while (players[nextPlayerIndex].lost) {
                // playess..? i mean PLAYERS index start from 0 end at 6
                // 1 % 7 = 1 | 2 % 7 = 2 ... 7 % 7(players.length) = 0
                nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
            }
            socket.emit("switch-players", nextPlayerIndex, roomId);
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
            if(!playerHasOrbs && playerHasPlayed[player.index]){
                // console.log(playerHasPlayed,"lost: ", player.lost)
                player.lost = true;
                socket.emit("player-lost", player.index, roomId);
                if(user === player.id){handleLoseGame()}
            }
        })

        //get the numbers of players alive
        let numOfPlayersAlive = players.filter(player => !player.lost);

        // if number of players alive is 1.. then game over
        // that means u lost.. dumbhead
        if(numOfPlayersAlive.length === 1){
            setIsGameOver(true); // mata ashitha
            if(user === numOfPlayersAlive[0].id){handleWinGame()};
            // console.log(`${players.filter(p => p.lost).map(p => p.name)}`);
        }
    }

    async function wait(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function checkForExplosion(tempGrid, startRow, startCol, playerIndex) {
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
                    tempGrid = explodeCell(tempGrid, row, col, visited, playerIndex);
                    incrementScore(5, playerIndex);
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
    
    function explodeCell(tempGrid, row, col, visited, playerIndex) {
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
            // why position?? coz u shithead tried something
            // which clearly didn't work
            // and u goldfish memory holder forgot to cleanup 🤦‍♂️
        ];
    
        neighbors.forEach((neighbor) => {
            if (isValidCell(neighbor.row, neighbor.col)) {
                // whyyyyyyyyyy doesnt states work T-T

                // and i return to say the same thing... 
                // why doesnt states freakin work ヽ(*。>Д<)o゜
                newGrid[row][col].owner != null ? incrementScore(15, playerIndex) : incrementScore(10, playerIndex);
                newGrid[neighbor.row][neighbor.col].orbs += 1;
                newGrid[neighbor.row][neighbor.col].owner = playerIndex;
                visited.delete(`${neighbor.row}-${neighbor.col}`);
            }
        });

        return newGrid;
    }

    return (
        <div class="bg-game-gradient lg:min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-8 w-full gap-8">

        <p className="text-lg sm:text-xl font-semibold text-blue-600 bg-blue-100 px-3 mt-3 rounded-md shadow-md inline-block">
            Current Player: <span className="text-green-600">{players[currentPlayerIndex]?.name}</span>
         </p>

            <div class="flex-2">
                <div 
                    className="grid mx-auto mx-4 my-4" 
                    style={{  
                        maxWidth: `${cols * 4}rem`, 
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, 
                        boxShadow: `0px 0px 25px 8px ${(players[currentPlayerIndex].id === user) ? players[currentPlayerIndex].color : `#fff`}`
                    }}
                >
                    
                    {grid.map((row, rowIndex) => {
                        return row.map((cell, colIndex) => {
                            {/* idh easy irbeku thane.. nan advance css 😭 kalibekagithu*/}
                            return (
                                // how the heck do u add default orbs T-T
                                // i can't.. i give up ✊
                                // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ_51EOe1HpmkPggkQTaQamn5IJXHGEH7kB-aGJK2PyUjX9_Pl
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                    cell={cell}
                                    currentPlayerIndex={currentPlayerIndex}
                                    players={players}
                                    handleCellClick={handleCellClick}
                                />
                            );
                        });
                    })}
                </div>
            </div>

            <div className="text-center flex-1 flex flex-col justify-around items-center lg:w-64">
                
                    {isGameOver && (
                        <>
                            <div className="bg-gray-100 rounded-lg p-4 shadow-lg text-center space-y-2">
                                <p className="text-xl font-bold text-green-600">
                                    {`Congrats ${players[currentPlayerIndex].name}!`}
                                </p>
                                <p className="text-md text-red-600 font-semibold bg-red-100 rounded-md p-3 shadow-inner">
                                    <span role="img" aria-label="boo">😜 </span> 
                                    {`${players
                                        .filter((player) => player.lost)
                                        .map((p) => p.name)
                                        .join(', ')} - shame on you!`} 
                                </p>
                            </div>

                            <button
                                className="my-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                                onClick={() => socket.emit("restart-game", roomId)}
                            >
                                Restart Game
                            </button>
                        </>
                    )}
                <Leaderboard players={players} gameOver={isGameOver} />
            </div>

        </div>
    );
}

export default OnlineGameGrid;

