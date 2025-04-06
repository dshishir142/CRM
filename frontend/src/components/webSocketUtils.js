import { useState } from "react";
import { toast } from "react-toastify";

let socket = null;

export const WebSocketClient = ( user_id) => {
    if(!socket || socket.readyState !== WebSocket.OPEN){
        socket = new WebSocket('ws://localhost:8000')

        socket.onopen = () => {
            console.log("Websocket connected");
            socket.send(JSON.stringify({ type: "register", agent_id: user_id }));
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if(data.type === 'notification'){
                toast(data.message, {
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0.5,
                    theme: "light",
                    })
            }
        }

        socket.onclose = () => {
            console.log("Websocket disconnected");
            setTimeout(()=>{
                WebSocketClient(user_id);
            }, 5000)
        }
    }
}

export const closeWebSocket = () => {
    if(socket){
        socket.close();
        socket = null;
    }
}