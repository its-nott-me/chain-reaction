import React, { useState, memo } from "react";
import OneOrb from "../gameComponents/orbs/OneOrb";
import TwoOrbs from "../gameComponents/orbs/TwoOrbs";
import ThreeOrbs from "../gameComponents/orbs/ThreeOrbs";
import "../gameComponents/orbs/SampleOrb.css";
import XplosionOrb from "../gameComponents/orbs/XplosionOrb";


// store all the states (data) of the game in a gameState variable.. and save it in redis
// to continue the game from where it was left off

const rows = 12;
const cols= 6;

//get number of players and their user-names from user through main component

// for now lets assume these are the details of 4 players
const players = [
    {
        index: 0,
        name: "player1",
        color: "#00FF40",
        score: 0,
        lost: false,
        hasPlayed: false,
    },
    {
        index: 1,
        name: "player2",
        color: "#2058FF",
        score: 0,
        lost: false,
        hasPlayed: false,
    },
    {
        index: 2,
        name: "player3",
        color: "#ff0000",
        score: 0,
        lost: false,
    },
    {
        index: 3,
        name: "player4",
        color: "#ffff00",
        score: 0,
        lost: false,
    },
];
const playerHasPlayed = Array.from({length: players.length}, () => false);
let isGameOver = false;

function GameGrid(){
    const [currentPlayerIndex, setcurrentPlayerIndex] = useState(0);
    const [grid, setGrid] = useState(() => 
        Array.from({length: rows}, () => {
            return Array.from({length: cols}, () => ({orbs: 0, owner: null, explode: false}));
        })
    );
    const [isExploding, setIsExploding] = useState(() => {
        return Array.from({length: rows}, () => {
            return Array.from({length: cols}, () => false)
        })
    })

    console.log(isExploding);

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
                className="border p-1 text-center bg-black w-16 h-16 flex items-center justify-center relative"
                style={{
                    cursor: ((currentPlayerIndex === cell.owner) || cell.owner === null) && "pointer",
                    borderColor: players[currentPlayerIndex]?.color,
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
            >
                {/* {isExploding[rowIndex][colIndex] && renderXplosionOrbs(rowIndex, colIndex, cell.owner)} */}
                {renderOrbs(cell.orbs, cell.owner)} {/* Render the orb component */}
            </div>
        );
    });

        function renderXplosionOrbs(rowIndex, colIndex, ownerIndex){
            if(ownerIndex === null) ownerIndex = currentPlayerIndex - 1;
            const capacity = getCellCapacity(rowIndex, colIndex);
            
            const explosionOrbs = [];
            for (let i = 0; i < capacity; i++) {
                explosionOrbs.push(<XplosionOrb key={`explosion-${i}`} className="explosion-orb" />);
            }
            
            const ToLeftOrb = <XplosionOrb destination="left" color={`${players[ownerIndex].color}`} />
            const ToRightOrb = <XplosionOrb destination="right" color={`${players[ownerIndex].color}`} />
            const ToUpOrb = <XplosionOrb destination="up" color={`${players[ownerIndex].color}`} />
            const ToDownOrb = <XplosionOrb destination="down" color={`${players[ownerIndex].color}`} />

            const xplosionOrbs = [];

            if(rowIndex < rows-1) xplosionOrbs.push(ToDownOrb);
            if(rowIndex > 0) xplosionOrbs.push(ToUpOrb);
            if(colIndex < cols-1) xplosionOrbs.push(ToRightOrb);
            if(colIndex > 0) xplosionOrbs.push(ToLeftOrb);
            setTimeout(() => setIsExploding(prev => {
                return Array.from({length: rows}, () => {
                    return Array.from({length: cols}, () => false)
                })
            }), 1000)
            return xplosionOrbs
        }

    async function handleCellClick(row, col){
        //show only the current player to place orbs in their cell or empty cell
        if((grid[row][col].owner === null || grid[row][col].owner === currentPlayerIndex) && !isGameOver){
            let newGrid = grid.map((cellRow, rowIndex) => {
                return cellRow.map((cell, colIndex) => {
                    if(colIndex === col && rowIndex === row){
                        return {
                            ...cell, 
                            orbs: cell.orbs + 1, 
                            owner: currentPlayerIndex
                        }
                    }
                    return cell;
                })
            })
            
            // pass this newGrid (temporary grid) to get checked for xplosions
            newGrid = await checkForExplosion(newGrid, row, col);

            // after all the explosions are done.. now set the newGrid 
            setGrid(newGrid);

            //check if anyone lost;
            checkIfPlayerLost();
            playerHasPlayed[currentPlayerIndex] = true;
            // hand over turn to next player
            setcurrentPlayerIndex(prev => {
                let nextPlayerIndex = (prev+1)%players.length;
                while(players[nextPlayerIndex].lost){
                    nextPlayerIndex = (nextPlayerIndex+1)%players.length;
                }
                return nextPlayerIndex;
            })
        }
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
        console.log("checking");
        // waaaaaaaaaaaaaaaaaaaa i am dumb
        players.forEach((player) => {
            let playerHasOrbs = tempGrid.some(r => r.some(cell => 
                cell.owner === player.index && cell.orbs > 0
            ))

            if(!playerHasOrbs && playerHasPlayed[player.index]){
                console.log(playerHasPlayed, player.lost)
                player.lost = true;
            }
        })

        //get the numbers of players alive
        let numOfPlayersAlive = players.filter(player => !player.lost);

        // if number of players alive is 1.. then game over
        if(numOfPlayersAlive.length === 1){
            gameOver();
        }
    }

    function gameOver(){
        let winnerIndex = players.filter(player => player.lost === false)[0].index;
        console.log(players[winnerIndex]);
        isGameOver = true;
    }

    async function wait(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // async function checkForExplosion(tempGrid, startRow, startCol){
    //     const queue = [{row: startRow, col: startCol}]; // current cell
    //     const visited = new Set();

    //     while(queue.length > 0){
    //         const {row, col} = queue.shift(); // similar to dequeue
    //         const cellKey= `${row}-${col}`;

    //         // T-T this logic was so damn hard to come up with
    //         // shut up i wanna cry ＞︿＜
    //         // i fricking spent the entire day on this ahhuhhhh
    //         if(visited.has(cellKey)) continue; //continue if cell has already been checked
    //         visited.add(cellKey);
    //         const cell = tempGrid[row][col];
    //         const capacity = getCellCapacity(row, col);
    //         // explosion logic (i fried my brain trying to figure this out X﹏X)
    //         if(cell.orbs >= capacity){
    //             tempGrid = explodeCell(tempGrid, row, col, visited);
    //             //possible neighbors which might xplode after addition of orbs
    //             const neighbors = [
    //                 {row: row-1, col: col}, // up
    //                 {row: row+1, col: col}, // down
    //                 {row: row, col: col+1}, // the other left?
    //                 {row: row, col: col-1}, // left
    //             ]

    //             neighbors.forEach((neighbor) => {
    //                 if(isValidCell(neighbor.row, neighbor.col)){
    //                     // add to queue to check for explosions
    //                     queue.push(neighbor);
    //                 }
    //             })

    //             // ye kya logic use kiya hai maine T=T
    //             //  mereko sachi mai rona aa raha hai
    //             checkIfPlayerLost(tempGrid);
    //         }
    //     }
    //     return tempGrid;
    // }

    function checkForExplosion(tempGrid, startRow, startCol) {
        const visited = new Set();
    
        // Recursive function to process explosions layer by layer with delay
        function processExplosionLayer(queue) {
            if (queue.length === 0) return; // Base case: stop if no more cells to process
    
            const nextQueue = []; // Queue for the next layer of explosions
    
            while (queue.length > 0) {
                const { row, col } = queue.shift(); // Dequeue the current cell
                const cellKey = `${row}-${col}`;
    
                if (visited.has(cellKey)) continue; // Skip if cell has already been processed
                visited.add(cellKey);
    
                const cell = tempGrid[row][col];
                const capacity = getCellCapacity(row, col);
    
                if (cell.orbs >= capacity) {
                    tempGrid = explodeCell(tempGrid, row, col, visited);
    
                    // Add neighboring cells to the next layer queue if they are valid
                    const neighbors = [
                        { row: row - 1, col: col }, // up
                        { row: row + 1, col: col }, // down
                        { row: row, col: col + 1 }, // right
                        { row: row, col: col - 1 }, // left
                    ];

                    setIsExploding(prev => (
                        prev.map((r, rowIndex) => {
                            return r.map((cell, colIndex) => {
                                if(row === rowIndex && col === colIndex){
                                    return true;
                                }
                                return cell
                            })
                        })
                    ))
    
                    neighbors.forEach((neighbor) => {
                        if (isValidCell(neighbor.row, neighbor.col)) {
                            nextQueue.push(neighbor);
                        }
                    });
                }
            }
    
            // Update the grid state after each layer to visualize changes
            setGrid([...tempGrid]); // Assuming setGrid is your state updater for the grid
    
            // Check if the next layer has any cells to process, add delay before the next call
            if (nextQueue.length > 0) {
                setTimeout(() => processExplosionLayer(nextQueue), 1000); // 1-second delay for next explosion layer
            } else {
                // Final check after all explosions are processed
                checkIfPlayerLost(tempGrid);
            }
        }
    
        // Add a 1-second delay before starting the first explosion layer
        setTimeout(() => processExplosionLayer([{ row: startRow, col: startCol }]), 1000);
    
        return tempGrid;
    }
    

    function explodeCell(tempGrid, row, col, visited){
        let newGrid = tempGrid.map((r) => r.map((c) => ({...c}))); //Deep copy

        newGrid[row][col] = {
            orbs: 0,
            owner: null,
            explode: true,
        }
        
        // possible neighbors
        const neighbors = [
            {row: row-1, col: col, position: "up"}, // up
            {row: row+1, col: col, position: "down"}, // down
            {row: row, col: col+1, position: "right"}, // right
            {row: row, col: col-1, position: "left"}, // the other right
        ]

        neighbors.forEach((neighbor) => {
            // add orbs to valid cells
            if(isValidCell(neighbor.row, neighbor.col)){
                // render a OneOrb component at (row, col) posisiton
                // animate the orb moving from (row, col) position to (neighbor.row, neighbor.col) position
                // after the orb reaches the destination.. delete the orb
                // now proceed with the rest of the code
                newGrid[neighbor.row][neighbor.col].orbs += 1;
                newGrid[neighbor.row][neighbor.col].owner = currentPlayerIndex;
                visited.delete(`${neighbor.row}-${neighbor.col}`);
            }
        })

        return newGrid;
    }

    return (
        <div className="text-center">
            <h2>{players[currentPlayerIndex].name}</h2>
            <br />
            <div className="grid grid-cols-6 mx-auto" style={{ maxWidth: "380px" }}>
                {grid.map((row, rowIndex) => {
                    return row.map((cell, colIndex) => {
                        {/* idh easy irbeku thane.. nan advance css 😭 kalibekagithu*/}
                        return (
                            // how the heck do u add default orbs T-T
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
    );
}

export default GameGrid;