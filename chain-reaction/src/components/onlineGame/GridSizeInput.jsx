import React, { useEffect, useState } from 'react';

function GridSizeInput({gridSizeData, canEditInput}) {
    const {gridSize, setGridSize} = gridSizeData;
    // const [rows, setRows] = useState("12");
    // const [cols, setCols] = useState("6");
    const {rows, cols} = gridSize;
    const [isInvalid, setIsInvalid] = useState(false);
    const [isNotHidden, setIsNotHidden] = useState(false);

    // console.log(canEditInput)

    useEffect(() => {
        isInvalid ? setGridSize({rows: 12, cols: 6}) : setGridSize({rows: rows, cols: cols});
    }, [rows, cols])

    const handleRowChange = (e) => setGridSize(prev => ({...prev, rows: e.target.value}));
    const handleColumnChange = (e) => setGridSize(prev => ({...prev, cols: e.target.value}));

    const validateInput = () => {
        const rowsValue = parseInt(rows, 10);
        const colsValue = parseInt(cols, 10);

        const isValid = 
            rows !== "" && cols !== "" &&
            rowsValue >= 4 && rowsValue <= 20 &&
            colsValue >= 4 && colsValue <= 20;

        setIsInvalid(!isValid);
    };

    const renderGrid = () => {
        const rowCount = parseInt(rows, 10);
        const columnCount = parseInt(cols, 10);
        const gridElements = [];

        for (let i = 0; i < rowCount; i++) {
            const rowElements = [];
            for (let j = 0; j < columnCount; j++) {
                rowElements.push(<div key={`${i}-${j}`} className="grid-cell"></div>);
            }
            gridElements.push(<div key={i} className="grid-row">{rowElements}</div>);
        }

        return gridElements;
    };

    return (
        <div className="z-10 p-6 rounded-lg border border-grey-200 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
            <p className="text-2xl font-bold text-amber-200 mb-4 px-4 py-2">
                Grid Size Input
            </p>

            <button
                onClick={() => setIsNotHidden((prev) => !prev)}
                className="inline-flex items-center text-base font-medium text-amber-200 hover:text-orange hover:bg-blue-400 hover:border border-blue-600 px-4 py-2 rounded-lg transition duration-200 ease-in-out focus:outline-none"
            >
                <span className="mr-2">🔍</span> Click here to preview grid
            </button>

            <div className="flex flex-row items-center justify-center gap-6 mt-6">
                <div className="player-box flex flex-col items-center justify-center rounded-xl shadow-md bg-gray-50 p-4 w-32 text-gray-700 font-semibold">
                    <label className="text-sm mb-2">Rows:</label>
                    <input
                        type="number"
                        min="4"
                        max="20"
                        value={rows}
                        onChange={handleRowChange}
                        onBlur={validateInput}
                        className="p-2 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 text-center"
                        disabled={!canEditInput}
                    />
                </div>
                
                <div className="flex flex-col items-center justify-center rounded-xl shadow-md bg-gray-50 p-4 w-32 text-gray-700 font-semibold">
                    <label className="text-sm mb-2">Cols:</label>
                    <input
                        type="number"
                        min="4"
                        max="20"
                        value={cols}
                        onChange={handleColumnChange}
                        onBlur={validateInput}
                        className="p-2 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 text-center"
                        disabled={!canEditInput}
                    />
                </div>
            </div>

            {isInvalid && (
                <p className="text-sm text-red-600 mt-4 font-medium">
                    Please enter values between 4 and 20. <br /> Default size 12x6 will be chosen.
                </p>
            )}

            {isNotHidden && (
                <div className="flex justify-center mt-6">
                    <div className="p-6 border-2 border-gray-200 bg-gray-900 rounded-xl shadow-lg">
                        {(!isInvalid && rows && cols) ? (
                            <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                            {Array.from({ length: rows * cols }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="w-6 h-6 bg-yellow-500 border border-yellow-700 rounded-md shadow-lg transform transition-transform hover:scale-105"
                                />
                            ))}
                        </div>
                        ) : (
                            <p className="text-gray-500 text-lg font-semibold">No Grid Preview</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GridSizeInput;
