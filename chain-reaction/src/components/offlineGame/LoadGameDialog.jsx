import React, { useState, useEffect } from "react";
import axios from "axios";

function LoadGameDialog({ loadGame }) {
    const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
    const [saveSlots, setSaveSlots] = useState([null, null, null]);
    const [slotNames, setSlotNames] = useState(["Empty Slot", "Empty Slot", "Empty Slot"]);

    function openLoadDialog() { setIsLoadDialogOpen(true); }
    function closeLoadDialog() { setIsLoadDialogOpen(false); }

    useEffect(() => {
        getSaves();
    }, []);

    async function getSaves() {
        const result = await axios.get("/retrieveSaves");
        const saves = result.data;

        if (saves.length > 0) {
            saves.forEach((save) => {
                if(save){
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
            <button onClick={openLoadDialog} className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-[#0eea5e] hover:scale-[1.1] transform transition-all duration-300 ease-in-out">
                Load Game
            </button>

            {isLoadDialogOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white max-w-sm mx-auto rounded shadow-md p-6">
                        <div className="text-center">
                            <p className="text-lg font-bold mb-4">Load Game Slot</p>
                            <p className="text-sm mb-6">Select a slot to load your saved game.</p>
                        </div>
                        <div className="flex flex-col space-y-3 mb-4">
                            {saveSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (slot) {
                                            loadGame(slot); // Call the loadGame function with the selected slot data
                                            closeLoadDialog();
                                        }
                                    }}
                                    className={`w-full py-2 rounded-md shadow transition-colors duration-200 ${
                                        slot ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-white cursor-not-allowed"
                                    }`}
                                >
                                    {slotNames[index]}
                                </button>
                            ))}
                        </div>
                        <button onClick={closeLoadDialog} className="text-gray-500 hover:bg-gray-200 w-full py-2 rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default LoadGameDialog;
