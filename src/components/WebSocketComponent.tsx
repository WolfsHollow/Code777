import { createContext, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/customHook";
import { selectUsername } from "./gameStateSlice";

const WebSocketContext = createContext(null);

export { WebSocketContext };

const TYPE = {
    JOIN: "join",
    LEAVE: "leave",
    MESSAGE: "message",
    SUBSCRIBE: "subscribe",
    GAME_ACTION: "gameAction",
}

const WebSocketComponent = ({ children }) => {

    const socket = new WebSocket('ws://localhost:8082');
    const username = useAppSelector(selectUsername);
    const subscription = useRef([]);

    const subscribe = (roomID) => {
        subscription.current.push(roomID)
        sendMessage(username, TYPE.SUBSCRIBE, roomID)
    }

    const sendMessage = (sender: string, type: string, payload, roomID?: string,) => {
        const message = {
            sender: sender,
            type: type,
            payload: payload,
        }
        socket.send(JSON.stringify(message));
    }

    socket.addEventListener('message', e => {
        console.log('stuff is happening', e);
    });


    socket.addEventListener('open', () => {
        console.log('we connected yo');
        sendMessage('me', TYPE.SUBSCRIBE, 'heooeo')
    });

    socket.addEventListener('close', () => {
        console.log('we not connected yo');
    });

    let ws = {
        socket,
        sendMessage,
        subscribe,
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketComponent;