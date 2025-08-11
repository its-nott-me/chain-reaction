import React, { useState } from 'react';

const rows = 12;
const cols = 6;

const players = ['Player 1', 'Player 2'];
const playerColors = ['lightblue', 'lightgreen']; // Define colors for each player

function Game() {
    const [grid, setGrid] = useState(() =>
        Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({ orbs: 0, owner: null }))
        )
    );

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // Track current player
    const [playerHasPlayed, setPlayerHasPlayed] = useState([false, false]); // Track if players have played
    const [gameOver, setGameOver] = useState(false); // Track game over status

    function handleClick(row, col) {
        if (gameOver) return; // Prevent clicks if game is over

        const cell = grid[row][col];
        const currentPlayer = players[currentPlayerIndex];

        // Mark that the current player has played
        if (!playerHasPlayed[currentPlayerIndex]) {
            const newPlayerHasPlayed = [...playerHasPlayed];
            newPlayerHasPlayed[currentPlayerIndex] = true;
            setPlayerHasPlayed(newPlayerHasPlayed);
        }

        // Check if the clicked cell belongs to the current player
        if (cell.owner === currentPlayer) {
            // Add orb to own cell
            const newGrid = grid.map((r, rowIndex) => {
                return r.map((cell, colIndex) => {
                    if (rowIndex === row && colIndex === col) {
                        return {
                            ...cell,
                            orbs: cell.orbs + 1,
                            owner: currentPlayer // Ensure ownership is maintained
                        };
                    }
                    return cell;
                });
            });
            setGrid(newGrid);
            checkForExplosions(newGrid, row, col);
        } else if (cell.owner !== currentPlayer && cell.owner !== null) {
            // Do nothing if the player clicks an occupied opponent's cell
            // console.log("You cannot add orbs to your opponent's cell!");
        } else {
            // If the cell is empty, take ownership and add one orb
            const newGrid = grid.map((r, rowIndex) => {
                return r.map((cell, colIndex) => {
                    if (rowIndex === row && colIndex === col) {
                        return {
                            ...cell,
                            orbs: 1,
                            owner: currentPlayer // Take ownership of the cell
                        };
                    }
                    return cell;
                });
            });
            setGrid(newGrid);
            checkForExplosions(newGrid, row, col);
        }
    }

    function getCellCapacity(row, col) {
        if ((row === 0 || row === rows - 1) && (col === 0 || col === cols - 1)) {
            return 2; // corner cells
        } else if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
            return 3; // edge cells
        } else {
            return 4; // inside cells
        }
    }

    function checkForExplosions(grid, row, col) {
        let queue = [[row, col]]; // Start with the clicked cell
        let exploded = false; // Track if any cell exploded
    
        const processExplosionLayer = () => {
            const nextQueue = []; // Prepare a new queue for the next layer of explosions
    
            while (queue.length > 0) {
                const [currRow, currCol] = queue.shift();
                const cellCapacity = getCellCapacity(currRow, currCol);
    
                if (grid[currRow][currCol].orbs >= cellCapacity) {
                    exploded = true;
                    grid = explodeCell(grid, currRow, currCol);
    
                    // Add neighbors to the next layer queue if they are valid cells
                    const neighbors = [
                        [currRow - 1, currCol], // up
                        [currRow + 1, currCol], // down
                        [currRow, currCol - 1], // left
                        [currRow, currCol + 1], // right
                    ];
    
                    for (const [nRow, nCol] of neighbors) {
                        if (isValidCell(nRow, nCol)) {
                            nextQueue.push([nRow, nCol]);
                        }
                    }
                }
            }
    
            setGrid([...grid]); // Update the grid after each explosion layer
    
            if (nextQueue.length > 0) {
                // Delay the next explosion layer by 1 second if there are more explosions to process
                queue = nextQueue;
                setTimeout(processExplosionLayer, 1000);
            } else {
                // Check game over status after all explosions are done
                if (exploded) checkGameOver(grid);
    
                // If not game over, switch to the next player
                if (!gameOver) {
                    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
                }
            }
        };
    
        // Start the first layer of explosions with a 1-second delay
        setTimeout(processExplosionLayer, 1000);
    }
    

    function explodeCell(grid, row, col) {
        const newGrid = grid.map(r => r.map(cell => ({ ...cell }))); // Deep copy

        newGrid[row][col].orbs = 0; // Reset the cell's orbs
        const previousOwner = newGrid[row][col].owner; // Store the previous owner's reference

        newGrid[row][col].owner = null; // Reset ownership to null

        // Add orbs to neighbors
        const neighbors = [
            [row - 1, col], // up
            [row + 1, col], // down
            [row, col - 1], // left
            [row, col + 1], // right
        ];

        for (const [nRow, nCol] of neighbors) {
            if (isValidCell(nRow, nCol)) {
                newGrid[nRow][nCol].orbs += 1; // Increment neighbor's orbs
                if (previousOwner) {
                    newGrid[nRow][nCol].owner = previousOwner; // Transfer ownership to the exploding player
                }
            }
        }

        return newGrid;
    }

    function isValidCell(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols;
    }

    function checkGameOver(grid) {
        const currentPlayer = players[currentPlayerIndex];
        const otherPlayerIndex = (currentPlayerIndex + 1) % players.length;
        const otherPlayer = players[otherPlayerIndex];

        const otherPlayerHasOrbs = grid.some(row => row.some(cell => cell.owner === otherPlayer && cell.orbs > 0));
        const currentPlayerHasOrbs = grid.some(row => row.some(cell => cell.owner === currentPlayer && cell.orbs > 0));

        // Check if the other player has no orbs
        if (!otherPlayerHasOrbs) {
            setGameOver(true);
            return;
        }

        // If the current player has no orbs and has played at least once
        if (!currentPlayerHasOrbs && playerHasPlayed[currentPlayerIndex]) {
            setGameOver(true);
        }
    }

    return (
        <div className="text-center">
            <h2>{gameOver ? "Game Over" : `${players[currentPlayerIndex]}'s Turn`}</h2>
            <div className="grid grid-cols-6 mx-auto" style={{ maxWidth: "380px" }}>
                {grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className="border p-4 text-center bg-gray-100 w-16 h-16"
                            onClick={() => handleClick(rowIndex, colIndex)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: cell.owner === players[0] ? playerColors[0] : cell.owner === players[1] ? playerColors[1] : 'gray',
                                border: `2px solid ${currentPlayerIndex === 0 ? playerColors[0] : playerColors[1]}`, // Change outline color based on current player
                            }} 
                        >
                            {cell.orbs}
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
}

export default Game;
