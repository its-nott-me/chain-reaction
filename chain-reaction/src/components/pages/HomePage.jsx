import React from "react";
import Header from "../headers/header";
import OAuthButton from "../OAuthButton";
import LogoutButton from "../LogoutButton";
// import Game from "./GamePage";

function HomePage(){

    return(
        <>
            <Header />
            <a href="/socket">
                socket page
            </a>
            
            <br />
            <OAuthButton />

            <br />
            <LogoutButton />

            {/* <br />
            <a href = "/game">
                Game 
            </a>
            <Game /> */}
        </>
    )
}

export default HomePage;