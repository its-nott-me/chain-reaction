import React from "react";

function OAuthButton(){
    function handleLogin(){
        window.location.href = "http://localhost:5000/auth/google";
    };

    return (
        <button 
            onClick={handleLogin} 
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-110"
        >
            Login with Google
        </button>
    );
}

export default OAuthButton;
