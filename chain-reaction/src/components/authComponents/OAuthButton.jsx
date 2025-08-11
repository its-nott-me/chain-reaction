import React from "react";

function OAuthButton(){
    const apiURL = process.env.REACT_APP_API_URL;
    function handleLogin(){
        window.location.href = `${apiURL}/auth/google`;
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
