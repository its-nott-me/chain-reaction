import React from "react";
import Header from "../headers/header";
import OAuthButton from "../OAuthButton";
import LogoutButton from "../LogoutButton";
import Game from "./GamePage";
import axios from "axios";
import OneOrb from "../gameComponents/OneOrb";
import TwoOrbs from "../gameComponents/TwoOrbs";
import ThreeOrbs from "../gameComponents/ThreeOrbs";
import SampleOrb from "../gameComponents/SampleOrb";
import GameGrid from "./GameGrid";
import GamePage from "./GamePage";

function HomePage(){

    async function checkIfAuthenticated(){
        // let {authenticated} = axios.get("/auth/check");
        // console.log(authenticated);
    }

    checkIfAuthenticated();

    let colors = ["#5cabff", "#ff5733", "#28a745"];

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

            <br />
            <a href = "/game">
                Game 
            </a>
            

            <br />

            <br />
            <GamePage />

        </>
    )
}

export default HomePage;