import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton(){
    const navigate = useNavigate();
    function handleLogout(){
        localStorage.removeItem("token");
        navigate("/logoutSuccess");
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
