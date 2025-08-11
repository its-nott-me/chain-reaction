import React, { useEffect, useState } from 'react';

function GridSizeInput({ setGridSize }) {
    const [rows, setRows] = useState("12");
    const [columns, setColumns] = useState("6");
    const [isInvalid, setIsInvalid] = useState(false);
    const [isNotHidden, setIsNotHidden] = useState(false);

    useEffect(() => {
        isInvalid ? setGridSize({ rows: 12, cols: 6 }) : setGridSize({ rows, cols: columns });
    }, [rows, columns]);

    const handleRowChange = (e) => setRows(e.target.value);
    const handleColumnChange = (e) => setColumns(e.target.value);

    const validateInput = () => {
        const rowsValue = parseInt(rows, 10);
        const columnsValue = parseInt(columns, 10);
        const isValid =
            rows !== "" &&
            columns !== "" &&
            rowsValue >= 3 && rowsValue <= 20 &&
            columnsValue >= 3 && columnsValue <= 20;

        setIsInvalid(!isValid);
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg space-y-6 text-white">
            <h2 className="text-2xl font-bold text-yellow-300 text-center">Grid Size Input</h2>

            <button
                onClick={() => setIsNotHidden(prev => !prev)}
                className="text-sm w-full text-yellow-300 hover:text-yellow-100 transition underline text-center block"
            >
                Click here to preview grid
            </button>

            <div className="flex justify-center items-center gap-8">
                <div className="flex flex-col items-center space-y-2">
                    <label className="text-lg font-medium">Rows</label>
                    <input
                        type="number"
                        min="3"
                        max="20"
                        value={rows}
                        onChange={handleRowChange}
                        onBlur={validateInput}
                        className="w-20 text-center p-2 rounded-md bg-white text-gray-800 font-semibold border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <label className="text-lg font-medium">Columns</label>
                    <input
                        type="number"
                        min="3"
                        max="20"
                        value={columns}
                        onChange={handleColumnChange}
                        onBlur={validateInput}
                        className="w-20 text-center p-2 rounded-md bg-white text-gray-800 font-semibold border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
            </div>

            {isInvalid && (
                <p className="text-rose-300 text-sm text-center">
                    Please enter values between 3 and 20.<br />
                    Default size 12x6 will be chosen.
                </p>
            )}

            {isNotHidden && (
            <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-center">
                {(!isInvalid && rows && columns) ? (
                <div
                    className="grid gap-1"
                    style={{
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gridTemplateColumns: `repeat(${columns}, 1fr)`
                    }}
                >
                    {Array.from({ length: rows * columns }).map((_, idx) => (
                    <div
                        key={idx}
                        className="w-6 h-6 bg-yellow-500 border border-yellow-700 rounded-md shadow-lg transform transition-transform hover:scale-105"
                    />
                    ))}
                </div>
                ) : (
                <p className="text-gray-300 text-center">No Grid Preview</p>
                )}
            </div>
            )}

        </div>
    );
}

export default GridSizeInput;
