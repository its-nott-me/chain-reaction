import React from "react";

function LogoutButton(){
    function handleLogout(){
        window.location.href = "http://localhost:5000/logout"
    }

    return(
        <>
            <button onClick={handleLogout}>
                Google logout
            </button>
        </>
    )
}

export default LogoutButton;