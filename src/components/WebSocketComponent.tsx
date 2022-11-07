import { createContext, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/customHook";
import { selectUsername, startGame, updatePlayersFromMessage } from "./gameStateSlice";
import { v4 as uuidv4 } from 'uuid';
import { TYPE } from "../data/constants";


const WebSocketContext = createContext(null);

export { WebSocketContext };




const USER_LIST = 'userList';

let socket;

const WebSocketComponent = ({ children }) => {

    const username = useAppSelector(selectUsername);
    const subscription = useRef();
    const userID = useRef();
    const [playersInRoom, setPlayersInRoom] = useState([]);

    const dispatch = useAppDispatch();

    const connect = (roomID) => {
        try {
            userID.current = uuidv4(); // create here a uuid for this connection
            socket = new WebSocket('ws://localhost:8082');
            if (!roomID) roomID = userID.current;
            addListeners(roomID);
        }
        catch (error) {
            console.log(error);
            console.log('Server not available');
        }
    }

    const onConnected = (roomID) => {
        subscribe(roomID);
    }

    const subscribe = (roomID) => {
        subscription.current = roomID;
        sendMessage(username, TYPE.SUBSCRIBE, roomID)
    }

    const sendMessage = (sender: string, type: string, payload, roomID?: string,) => {
        const message = {
            sender: sender,
            userID: userID.current,
            roomID: subscription.current,
            type: type,
            payload: payload,
        }
        socket.send(JSON.stringify(message));
    }

    const updatePlayerLists = (playersObject) => {
        console.log(playersObject); //{player: playerNumber}
        let playerList = [];
        let playerOrder = ['', '', '', ''];
        Object.keys(playersObject).forEach((key, index) => {
            let value = playersObject[key];
            playerList.push(key);
            if (value !== -1) {
                playerOrder[value] = key;
            }
        })
        setPlayersInRoom(playerList);
        dispatch(updatePlayersFromMessage(playerOrder));
    }

    const initializeGame = (payload) => {
        dispatch(startGame(payload));
    }

    const addListeners = (roomID) => {
        socket.addEventListener('message', (message) => {

            let { sender, userID, type, payload } = JSON.parse(message.data);

            console.warn({ sender, userID, type, payload });
            switch (type) {
                case TYPE.INITIALIZE_GAME: // payload:  deck, questionlist, players
                    initializeGame(payload)
                    break;
                case TYPE.GUESS:

                    break;

                case TYPE.NEXT_QUESTION:

                    break;
                case TYPE.LOBBY_INFO:
                    updatePlayerLists(payload); // {playerID: playerNumber}
                    break;
                case TYPE.MESSAGE:
                    console.log('there was a message', payload);
                    break;
                case 'broadcast':
                    console.log(sender, payload);
                    break;

                default:
                    console.log('problem with type');
                    break;
            }

        });

        socket.addEventListener('open', () => {
            console.log('we connected yo');
            sendMessage(userID.current, TYPE.JOIN, [roomID])
            onConnected(roomID);
        });

        socket.addEventListener('close', () => {
            const message = {
                sender: userID.current,
                type: TYPE.LEAVE,
                payload: userID.current,
            }
            socket.send(JSON.stringify(message));
            console.log('we not connected yo');
        });
    }

    let ws = {
        socket,
        sendMessage,
        subscribe,
        connect,
        playersInRoom,

    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketComponent;