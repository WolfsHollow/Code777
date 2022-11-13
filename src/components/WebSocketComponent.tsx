import { createContext, useRef, useState } from "react";
import useUpdateEffect, { useAppDispatch, useAppSelector } from "../hooks/customHook";
import { receiveGuess, selectPlayers, selectUsername, startGame, startNextTurn, updatePlayers, } from "./gameStateSlice";
import { v4 as uuidv4 } from 'uuid';
import { TYPE } from "../data/constants";
import { Navigate, useNavigate } from "react-router-dom";


const WebSocketContext = createContext(null);

export { WebSocketContext };

const USER_LIST = 'userList';

let socket;

const WebSocketComponent = ({ children }) => {

    const username = useAppSelector(selectUsername);
    const subscription = useRef();
    const userID = useRef();
    const host = useRef();
    const [playersInRoom, setPlayersInRoom]: [Object, any] = useState([]);
    const [roomJoined, setRoomJoined]: [string, any] = useState('roomID');
    const players = useAppSelector(selectPlayers);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const connect = (roomID: string) => {
        try {
            userID.current = uuidv4(); // create here a uuid for this connection
            socket = new WebSocket('ws://localhost:8082');
            if (!roomID) roomID = userID.current;
            setRoomJoined(roomID);
            addListeners(roomID);
        }
        catch (error) {
            console.log(error);
            console.log('Server not available');
        }
    }

    const onConnected = (roomID: string) => {
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
            roomID: roomID ? roomID : subscription.current,
            type: type,
            payload: payload,
        }
        try {
            socket.send(JSON.stringify(message));
        }
        catch (error) {
            console.error('NOT CONNECTED TO SOCKET');
        }
    }

    const updatePlayerLists = (playersObject: Object) => {
        let newPlayers = ['', '', '', ''];
        Object.keys(playersObject).forEach((key, index) => {
            let value = playersObject[key];
            if (value !== -1) {
                newPlayers[value] = key;
            }
        })
        setPlayersInRoom(playersObject);
        dispatch(updatePlayers(newPlayers));
    }

    const addListeners = (roomID) => {
        socket.addEventListener('message', (data, isBinary) => {

            let message = isBinary ? data : data.toString();

            let { sender, userID, type, payload } = JSON.parse(data.data);

            console.warn({ sender, userID, type, payload });
            switch (type) {
                case TYPE.INITIALIZE_GAME: // payload:  deck, questionlist, hands, players
                    dispatch(startGame(payload));
                    navigate('room/game');
                    break;
                case TYPE.GUESS:
                    dispatch(receiveGuess(payload));
                    break;
                case TYPE.NEXT_QUESTION:
                    dispatch(startNextTurn());
                    break;
                case TYPE.LOBBY_INFO: //payload is playersinRoom   
                    updatePlayerLists(payload[0]);
                    host.current = payload[1];
                    break;
                case TYPE.MESSAGE:
                    console.log('there was a message', payload);
                    break;
                default:
                    console.log('problem with type', type);
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
        setPlayersInRoom,
        roomJoined,
        host
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketComponent;