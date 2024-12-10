import React from "react";
import { motion } from "framer-motion";

const LostGameDialog = ({ isOpen, onClose }) => {
    return (
        isOpen && (
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-lg shadow-lg p-6 w-96 text-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                >
                    <h2 className="text-2xl font-bold text-red-600">Game Over</h2>
                    <p className="mt-4 text-gray-600">What did u xpect❓❓ <br/>  ㄟ( ▔, ▔ )ㄏ</p>
                    <div className="mt-6 flex justify-center">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )
    );
};

export default LostGameDialog;
