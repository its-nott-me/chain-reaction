import React, { useEffect, useState } from 'react';
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
<div className="flex flex-col items-center space-y-6 p-8 rounded-xl ">

    <select
        value={selectedOption}
        onChange={handleSelect}
        className="w-72 p-4 rounded-lg text-violet-800 bg-fuchsia-400 text-2xl text-center hover:brightness-125 font-semibold text-xl shadow-xl focus:outline-none hover:scale-105 transition-all duration-300 ease-in-out transform "
    >
        <option value={2}>2 Players</option>
        <option value={3}>3 Players</option>
        <option value={4}>4 Players</option>
        <option value={5}>5 Players</option>
        <option value={6}>6 Players</option>
        <option value={7}>7 Players</option>
        <option value={8}>8 Players</option>
    </select>

    {/* <p className="text-xl text-yellow-300 font-semibold mt-4 drop-shadow-xl">
        Selected: {selectedOption}
    </p> */}
</div>

    );
}

export default DropdownMenu;
