import React, { useEffect, useState } from 'react';
import "./DropDownMenu.css";

function DropdownMenu({onSelect}) {
    const [selectedOption, setSelectedOption] = useState("2 Players");

    function handleSelect(event){
        onSelect(event.target.value);
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        onSelect(2);
    }, [])

    return (
        <>
            <div className="dropdown-container">
            <p>number of players</p>
                <select 
                    value={selectedOption} 
                    onChange={handleSelect} 
                    className="dropdown-menu"
                >
                    <option value={2}>2 Players</option>
                    <option value={3}>3 Players</option>
                    <option value={4}>4 Players</option>
                    <option value={5}>5 Players</option>
                    <option value={6}>6 Players</option>
                    <option value={7}>7 Players</option>
                    <option value={8}>8 Players</option>
                </select>
                <p className="selected-option">Selected: {selectedOption}</p>
            </div>
        </>
    );
}

export default DropdownMenu;
