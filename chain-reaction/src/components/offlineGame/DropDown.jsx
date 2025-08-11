import React, { useEffect, useState } from 'react';

function DropdownMenu({ onSelect }) {
    const [selectedOption, setSelectedOption] = useState("2 Players");

    useEffect(() => {
        onSelect(2); // Ensure 2 is passed as number
    }, []);

    function handleSelect(event) {
        const value = parseInt(event.target.value);
        setSelectedOption(event.target.value);
        onSelect(value);
    }

    return (
        <div className="flex flex-col items-center w-full max-w-md">
            <div className="w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-10 p-4 rounded-xl shadow-md">
                <select
                    value={selectedOption}
                    onChange={handleSelect}
                    className="w-full p-3 rounded-lg bg-white bg-opacity-70 text-gray-800 text-xl font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-200"
                >
                    <option value={2}>2 Players</option>
                    <option value={3}>3 Players</option>
                    <option value={4}>4 Players</option>
                    <option value={5}>5 Players</option>
                    <option value={6}>6 Players</option>
                    <option value={7}>7 Players</option>
                    <option value={8}>8 Players</option>
                </select>
            </div>
        </div>
    );
}

export default DropdownMenu;
