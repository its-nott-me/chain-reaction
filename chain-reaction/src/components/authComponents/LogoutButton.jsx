import React from "react";
import axios from "axios";

function LogoutButton(){
    const apiURL = process.env.REACT_APP_API_URL;
    async function handleLogout(){
        await axios.get(`${apiURL}/logout`);
        window.location.href = "/logoutSuccess";
    }

    return (
        <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-400 text-white font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-110"
        >
            Logout
        </button>
    );
}

export default LogoutButton;
