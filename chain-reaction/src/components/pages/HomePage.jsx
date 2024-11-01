import React from "react";
import Header from "../headers/header";
import OAuthButton from "../OAuthButton";
import LogoutButton from "../LogoutButton";
import Game from "./GamePage";
import axios from "axios";
import OneOrb from "../gameComponents/orbs/OneOrb";
import TwoOrbs from "../gameComponents/orbs/TwoOrbs";
import ThreeOrbs from "../gameComponents/orbs/ThreeOrbs";
import SampleOrb from "../gameComponents/orbs/SampleOrb";
import GameGrid from "./GameGrid";
import GamePage from "./GamePage";

function HomePage(){

    async function checkIfAuthenticated(){
        // let {authenticated} = axios.get("/auth/check");
        // console.log(authenticated);
    }

    checkIfAuthenticated();

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
            

            {/* setup the logic of choosing number of players.. etc etc */}
            <br />
            <a href = "/offline">
                Play offline
            </a>

        </>
    )
}

export default HomePage;