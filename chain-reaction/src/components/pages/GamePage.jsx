import React, { useState, useEffect } from "react";

// const rows = 6;
// const cols = 12;

// const createGrid = () => {
//     return Array(rows).fill(null).map(() =>
//         Array(cols).fill({ orbs: 0, owner: null })
//     );
// }

// const GameGrid = () => {
//     const [grid, setGrid] = useState(createGrid());
//     const [currentPlayer, setCurrentPlayer] = useState(1);

//     const getCellCapacity = (row, col) => {
//         if ((row === 0 || row === rows - 1) && (col === 0 || col === cols - 1)) {
//             return 1; // corner cells
//         }
//         if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
//             return 2; // edge cells
//         }
//         return 3; // inner cells
//     };

//     const handleCellClick = (row, col) => {
//         const newGrid = grid.map((r, i) =>
//             r.map((cell, j) => {
//                 if (i === row && j === col) {
//                     if (cell.owner === null || cell.owner === currentPlayer) {
//                         return { orbs: cell.orbs + 1, owner: currentPlayer };
//                     }
//                 }
//                 return cell;
//             })
//         );

//         setGrid(newGrid);
//         checkForExplosions(row, col, currentPlayer, newGrid);
//         setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Alternate turn
//     };

//     const checkForExplosions = (row, col, player, newGrid) => {
//         const queue = [[row, col]];

//         while (queue.length > 0) {
//             const [currentRow, currentCol] = queue.shift();
//             const cell = newGrid[currentRow][currentCol];
//             const capacity = getCellCapacity(currentRow, currentCol);

//             if (cell.orbs > capacity) {
//                 newGrid[currentRow][currentCol] = { orbs: 0, owner: null };
//                 distributeOrbs(currentRow, currentCol, player, newGrid, queue);
//             }
//         }
//         setGrid([...newGrid]); // Update grid after explosions
//     };

//     const distributeOrbs = (row, col, player, newGrid, queue) => {
//         const neighbors = [
//             [row - 1, col],
//             [row + 1, col],
//             [row, col - 1],
//             [row, col + 1],
//         ];

//         neighbors.forEach(([r, c]) => {
//             if (r >= 0 && r < rows && c >= 0 && c < cols) {
//                 newGrid[r][c] = {
//                     orbs: newGrid[r][c].orbs + 1,
//                     owner: player,
//                 };

//                 if (newGrid[r][c].orbs > getCellCapacity(r, c)) {
//                     queue.push([r, c]); // Add to explosion queue
//                 }
//             }
//         });
//     };

//     return (
//         <div>
//             <h2 className="text-center text-2xl font-bold mb-4">
//                 Player {currentPlayer}'s Turn
//             </h2>
//             <div className="grid grid-cols-12 gap-2 p-4">
//                 {grid.map((row, rowIndex) =>
//                     row.map((cell, colIndex) => (
//                         <div
//                             key={`${rowIndex}-${colIndex}`}
//                             onClick={() => handleCellClick(rowIndex, colIndex)}
//                             className={`border-2 rounded-lg w-12 h-12 flex items-center justify-center 
//                             ${cell.owner === 1 ? "bg-red-500" : cell.owner === 2 ? "bg-blue-500" : "bg-gray-200"}`}
//                         >
//                             {cell.orbs}
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default GameGrid;




const rows = 12;
const cols = 6;


function Game(){
    const [grid, setGrid] = useState(() => 
        Array.from({length: rows}, () => {
            return Array.from({length: cols}, () => ({orbs: 0}))
        })
    )

    function handleClick(row, col){
        console.log(row, col)
        const newGrid = grid.map((r, rowIndex) => {
            return r.map((cell, colIndex) => {
                if(rowIndex === row && colIndex === col){
                    return { ...cell, orbs: cell.orbs + 1};
                }
                return cell;
            })
        })
        setGrid(newGrid);
    }

    return (
        <div className="grid grid-cols-6 mx-auto" style={{maxWidth: "380px"}}>
            {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                    <div
                        key = {`${rowIndex}-${colIndex}`}
                        className = "border p-4 text-center bg-gray-100 w-16 h-16"
                        onClick={() => handleClick(rowIndex, colIndex)}
                        style={{cursor: "pointer"}} 
                    >
                        {cell.orbs}
                    </div>
                ))
            ))}
        </div>
    )
}

export default Game;