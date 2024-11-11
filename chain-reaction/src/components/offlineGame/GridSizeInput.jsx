import React, { useEffect, useState } from 'react';
import './GridSizeInput.css';

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

    const renderGrid = () => {
        const rowCount = parseInt(rows, 10);
        const columnCount = parseInt(columns, 10);
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
        <div className="grid-size-input-container">
            <h2>Grid Size Input</h2>
            <button onClick={() => setIsNotHidden(prev => !prev)}><p style={{fontSize: "14px", color: "grey" }}>click here to preview grid</p></button>
            <div className="input-fields">
                <label>
                    Rows:
                    <input
                        type="number"
                        min="3"
                        max="20"
                        value={rows}
                        onChange={handleRowChange}
                        onBlur={validateInput}
                        className="input-field"
                    />
                </label>
                < br />
                <label>
                    Columns:
                    <input
                        type="number"
                        min="3"
                        max="20"
                        value={columns}
                        onChange={handleColumnChange}
                        onBlur={validateInput}
                        className="input-field"
                    />
                </label>
            </div>
            {isInvalid && (
                <p className="error-text">Please enter values between 3 and 20.<br />default size 12x6 will be chosen</p>
            )}
            
            {isNotHidden && (
                <div className="grid-preview">
                    {(!isInvalid && rows && columns) ? renderGrid() : <p>No Grid Preview</p>}
                </div>
            )}
        </div>
    );
}

export default GridSizeInput;
