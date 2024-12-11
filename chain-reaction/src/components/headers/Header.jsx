import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="w-full h-[10vh] flex justify-center items-center p-5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-white shadow-lg">
            <div className="relative text-3xl font-extrabold tracking-wider">
                <Link to="/" className="text-yellow-300 hover:text-yellow-200 brightness-110 transition">
                    🎮 Chain Reaction
                </Link>
            </div>
        </header>
    );
}

export default Header;
