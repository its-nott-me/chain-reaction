import React, { useState, useEffect } from "react";
import axios from "axios";

function SaveGameDialog({ playersState, currentPlayerIndex, gridState, playerHasPlayed, gameOver, gridSize }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saveSlots, setSaveSlots] = useState([null, null, null]);
    const [slotNames, setSlotNames] = useState(["Empty Slot", "Empty Slot", "Empty Slot"]);
    const [isRenaming, setIsRenaming] = useState([false, false, false]);
    const [newSlotName, setNewSlotName] = useState([" ", " ", " "]);
    const [canSave, setCanSave] = useState(null);
    const apiURL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    function openSaveDialog() {
        if (gridState.some(r => r.some(cell => cell.orbs > 0))) { setCanSave(true); }
        setIsDialogOpen(true);
    }
    function closeSaveDialog() { setIsDialogOpen(false); }

    useEffect(() => {
        getSaves();
    }, []);

    const handleSaveGame = (slotIndex) => {
        if (saveSlots[slotIndex]) {
            const confirmOverwrite = window.confirm("This slot already has a saved game. Do you want to overwrite it?");
            if (!confirmOverwrite) return;
        }
        saveGame(slotIndex);
    };

    const saveGame = async (slotIndex) => {
        const gameData = {
            slotName: slotNames[slotIndex] || `Slot ${slotIndex + 1}`,
            slotIndex,
            gridState,
            gridSize,
            playersState,
            currentPlayerIndex,
            playerHasPlayed,
            timestamp: new Date(),
        };
        await axios.post(`${apiURL}/saveGame`, { gameData }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        setIsDialogOpen(false);
        getSaves();
    };

    const renameSlot = async (index, newName) => {
            const slotIndex = saveSlots[index]?.slotIndex; // Use the slotIndex stored in saveSlots
            
            setSlotNames((prev) => {
                const updatedNames = [...prev];
                updatedNames[index] = newName === " " ? "Empty slot" : newName;
                return updatedNames;
            });
        
            setIsRenaming((prev) => {
                const updatedRenaming = [...prev];
                updatedRenaming[index] = false;
                return updatedRenaming;
            });
        
            if (slotIndex !== undefined && newName !== " ") {
                await axios.post(`${apiURL}/renameSave`, { slotIndex, newName }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }); // Use slotIndex in request
            }
    };
    

    async function getSaves() {
        const result = await axios.get(`${apiURL}/retrieveSaves/abstract`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        const saves = result.data;

        if (saves != null) {
            saves.forEach((save) => {
                if (save) { // Checks if save is not null or undefined
                    const slotIndex = save.slotIndex;
        
                    setSaveSlots((prev) => {
                        const updatedSlots = [...prev];
                        updatedSlots[slotIndex] = save;
                        return updatedSlots;
                    });
        
                    setSlotNames((prev) => {
                        const updatedNames = [...prev];
                        updatedNames[slotIndex] = save.slotName;
                        return updatedNames;
                    });
                }
            });
        }
        
    }

    return (
<>
    <div>
        {!gameOver && (
            <button
                onClick={openSaveDialog}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
            >
                Save Game
            </button>
        )}

        {!canSave && isDialogOpen && (
            <p className="text-red-600 text-sm mt-2 text-center">
                Can't save an empty game!
            </p>
        )}

        {isDialogOpen && canSave && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white max-w-sm mx-auto rounded-lg shadow-md p-6 relative">
                    {/* Dialog Header */}
                    <div className="text-center">
                        <p className="text-lg font-bold mb-4 text-gray-800">
                            Save Game Slot
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            Select a slot to save your current game.
                        </p>
                    </div>

                    {/* Save Slots */}
                    <div className="flex flex-col space-y-3 mb-6">
                        {Array(3)
                            .fill(null)
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between space-x-2"
                                >
                                    {!isRenaming[index] ? (
                                        <>
                                            <button
                                                className={`w-full py-2 rounded-lg shadow transition-all duration-200 transform ${
                                                    saveSlots[index]
                                                        ? "bg-green-500 text-white hover:bg-green-600"
                                                        : "bg-red-500 text-white hover:bg-red-600"
                                                }`}
                                                onClick={() =>
                                                    handleSaveGame(index)
                                                }
                                            >
                                                {slotNames[index]}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setIsRenaming((prev) => {
                                                        const updatedRenaming = [
                                                            ...prev,
                                                        ];
                                                        updatedRenaming[
                                                            index
                                                        ] = true;
                                                        return updatedRenaming;
                                                    })
                                                }
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                Rename
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-2 w-full">
                                            <input
                                                type="text"
                                                value={
                                                    newSlotName[index] === " "
                                                        ? slotNames[index]
                                                        : newSlotName[index]
                                                }
                                                onChange={(e) =>
                                                    setNewSlotName((prev) => {
                                                        const updatedNames = [
                                                            ...prev,
                                                        ];
                                                        updatedNames[index] =
                                                            e.target.value;
                                                        return updatedNames;
                                                    })
                                                }
                                                className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                            <button
                                                onClick={() =>
                                                    renameSlot(
                                                        index,
                                                        newSlotName[index] ===
                                                            ""
                                                            ? slotNames[index]
                                                            : newSlotName[index]
                                                    )
                                                }
                                                className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105"
                                            >
                                                OK
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={closeSaveDialog}
                        className="text-gray-500 hover:bg-gray-200 w-full py-2 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
    </div>
</>

    );
}

export default SaveGameDialog;
