import React, { useEffect, useState } from 'react';
// import './GridSizeInput.css';

function GridSizeInput({setGridSize}) {
    const [rows, setRows] = useState("12");
    const [columns, setColumns] = useState("6");
    const [isInvalid, setIsInvalid] = useState(false);
    const [isNotHidden, setIsNotHidden] = useState(false);

    useEffect(() => {
        isInvalid ? setGridSize({rows: 12, cols: 6}) : setGridSize({rows: rows, cols: columns});
    }, [rows, columns])

    const handleRowChange = (e) => setRows(e.target.value);
    const handleColumnChange = (e) => setColumns(e.target.value);

    const validateInput = () => {
        const rowsValue = parseInt(rows, 10);
        const columnsValue = parseInt(columns, 10);

        const isValid = 
            rows !== "" && columns !== "" &&
            rowsValue >= 3 && rowsValue <= 20 &&
            columnsValue >= 3 && columnsValue <= 20;

        setIsInvalid(!isValid);
    };

    return (
<div className="flex w-auto flex-col items-center p-6 bg-[#E879F9] rounded-lg shadow-lg space-y-4 w-80">
    <h2 className="text-2xl font-bold text-[#7229E3]">Grid Size Input</h2>
    <button
        onClick={() => setIsNotHidden(prev => !prev)}
        className="text-md font-bold text-[#7229E3] hover:text-yellow-300 transition"
    >
        Click here to preview grid
    </button>
    <div className="flex flex-col space-y-4">
        <label className="flex items-center space-x-[33.5px]">
            <span className="text-[#7229E3] font-bold">Rows:</span>
            <input
                type="number"
                min="3"
                max="20"
                value={rows}
                onChange={handleRowChange}
                onBlur={validateInput}
                className="w-16 p-2 text-center border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 scrollbar-thin overflow-y-auto"
            />
        </label>
        <label className="flex items-center space-x-2">
            <span className="text-[#7229E3] font-bold">Columns:</span>
            <input
                type="number"
                min="3"
                max="20"
                value={columns}
                onChange={handleColumnChange}
                onBlur={validateInput}
                className="w-16 p-2 text-center border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
        </label>
    </div>
    {isInvalid && (
        <p className="text-rose-200 text-xl text-center">
            Please enter values between 3 and 20.
            <br />
            Default size 12x6 will be chosen.
        </p>
    )}
    {isNotHidden && (
        <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
            {(!isInvalid && rows && columns) ? (
                <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: rows * columns }).map((_, idx) => (
                        <div
                            key={idx}
                            className="w-6 h-6 bg-yellow-500 border border-yellow-700 rounded-md shadow-lg transform transition-transform hover:scale-105"
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-300">No Grid Preview</p>
            )}
        </div>
    )}
</div>

    );
}

export default GridSizeInput;
