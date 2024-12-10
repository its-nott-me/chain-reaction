import React, { useEffect } from "react";
import { io } from "socket.io-client";
import Header from "../headers/Header";


function SocketPage(){
    useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.on("connect", () => {
            console.log("Client connected to Socket.io server", socket.id);
        });

        return () => { // Cleanup on unmount
            socket.disconnect();
        };
    }, []
    );

    return (
        <div>
            <Header />
            <a href="/">back to home page</a>
        </div>
    );
};

export default SocketPage;