import React from "react";

function OAuthButton(){
    function handleLogin(){
        window.location.href = "http://localhost:5000/auth/google";
    };

    return(
        <button onClick={handleLogin}>
            Login with Google
        </button>
    );
}

export default OAuthButton;