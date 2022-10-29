import React, { useEffect, useState, createContext, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Stomp } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import { changePlayer, moveToPostGame, selectBoard } from './gameStateSlice';

import { PLAYER } from '../data/constants';
import { generateNewBoardArray } from '../utilities/helpers';
import {
    selectCurrentPlayer,
    selectShips,
    updateBoardAndShips,
    selectPlayerNumber,
    selectOpponentPlayerNumber,
    updateGameplayUIText,
    updateBoard,
    changeOnlinePlayerTurn,
    updateShotIndex,
    resetState,
} from './gameStateSlice'
import { WEBSOCKET_HOST } from '../appConfig';

const WebSocketContext = createContext(null);

export { WebSocketContext };
var stompClient;

const WebSocket = ({ children }) => {

    let socket;

    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        username: '',
        connected: false,
        message: '',
        sessionID: '',
    });

    const [publicChats, setPublicChats] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [gameList, setGameList] = useState([]);
    const [connected, setConnected] = useState(false);
    const [opponentName, setOpponentName] = useState(null);
    const [isOpponentReady, setIsOpponentReady] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [opponentShips, setOpponentShips] = useState([]);
    const [opponentShot, setOpponentShot] = useState(null);
    const [hasSurrendered, setHasSurrendered] = useState(false);
    const [hasPressWinButton, setHasPressWinButton] = useState(false);

    const ships = useSelector(selectShips);
    const currentPlayer = useSelector(selectCurrentPlayer);
    const playerNumber = useSelector(selectPlayerNumber);
    const opponentPlayerNumber = useSelector(selectOpponentPlayerNumber);
    const board = useSelector(selectBoard);

    const subscriptions = useRef([null, null, null]); //lobby, chat, game
    const registerUser = () => {
        connect();
    }

    const connect = () => {
        socket = new SockJS(`${WEBSOCKET_HOST}ws`);
        stompClient = Stomp.over(socket);
        // stompClient = Stomp.client('ws:http://localhost:8080/ws');
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        //Spring
        let chatSubscription = stompClient.subscribe('/chatroom/public/', onMessageReceived);
        let lobbySubscription = stompClient.subscribe('/message', onLobbyMessageReceived);
        //Rabbit
        // let chatSubscription = stompClient.subscribe('/topic/chatroom', onMessageReceived);
        // let lobbySubscription = stompClient.subscribe('/topic/message', onLobbyMessageReceived);

        subscriptions.current = [lobbySubscription, chatSubscription, null];

        setConnected(true);
        userJoin();
    }

    const userJoin = () => {
        let chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        // stompClient.send("/chatroom/public/", {}, JSON.stringify(chatMessage));
        stompClient.send("/app/message.newUser", {}, JSON.stringify(chatMessage));
    }


    //actions relating to lobby messages (user joining/leaving/game creation) (/message)
    const onLobbyMessageReceived = (payload) => {
        console.log(`%c Payload `, "color: cyan", JSON.parse(payload.body));
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                setActiveUsers(payloadData.activeUsers);
                setGameList(payloadData.gameList);
                break;
            case "LEAVE":
                setActiveUsers(payloadData.activeUsers);
                setGameList(payloadData.gameList);
                if (opponentName === payloadData.senderName) {
                    dispatch(updateGameplayUIText('Your opponent has disconnected!'));
                }
                break;
            case "GAME_INFO":
                setGameList(payloadData.gameList);
                break;
            case "SUBSCRIBE":
                setGameList(payloadData.gameList);
                if (payloadData.senderName !== userData.username) {
                    let newOpponent = JSON.parse(JSON.stringify(payloadData.senderName));
                    setOpponentName(newOpponent);
                }
                break;
            default:
                console.error('onLobbyMessage - status did not match');
                break;
        }
    }

    //actions relating to gameplay/deployment (/game)
    const onGameMessageReceived = (payload) => {
        console.log(`%c Payload `, "color: purple", JSON.parse(payload.body));
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                if (payloadData.senderName !== userData.username) {
                    let newOpponent = JSON.parse(JSON.stringify(payloadData.senderName));
                    setOpponentName(newOpponent);
                }
                break;
            case "LEAVE_SURRENDER": //opponent has surrendered
                if (payloadData.senderName !== userData.username) {
                    // console.log('received surrender message');
                    setHasSurrendered(true);
                    subscriptions.current[3].unsubscribe();//Spring
                    setTimeout(() => { // need timeout to let hassurrendered update
                        dispatch(moveToPostGame());
                    }, 1000);
                    //@DATABASE ? game potentially removed already when opponent left in gameplaymenu.js
                }
                break;
            case "LEAVE_WIN": //opponent has surrendered
                if (payloadData.senderName !== userData.username) {
                    // console.log('received win message');
                    setHasPressWinButton(true);
                    subscriptions.current[3].unsubscribe();//Spring
                    setTimeout(() => { // need timeout to let haswon update
                        dispatch(moveToPostGame());
                    }, 1000);
                    //@DATABASE ? game potentially removed already when opponent left in gameplaymenu.js
                }
                break;
            case "SHOT":
                if (payloadData.senderName !== userData.username) {
                    let shot = parseInt(payloadData.shot);
                    setOpponentShot(shot);
                    let myPlayerNumber = payloadData.player === "0" ? 1 : 0;
                    dispatch(updateShotIndex([myPlayerNumber, shot]))
                    dispatch(updateGameplayUIText('Your Opponent Has Taken a Shot!'));
                    let newBoard = payloadData.board;
                    newBoard[myPlayerNumber][shot] += 2;
                    dispatch(updateBoard(newBoard));
                    setTimeout(() => {
                        dispatch(changeOnlinePlayerTurn());
                    }, 1500)
                }
                break;
            case "READY":
                if (payloadData.senderName !== userData.username) {
                    setIsOpponentReady(true);
                    setOpponentShips(payloadData.ships[payloadData.player]);
                }
                else if (payloadData.senderName === userData.username) {
                    setIsReady(true);
                }
                break;
            default:
                console.error('onGameMessage - status did not match');
                break;
        }
    }

    //messages from chat (/chatroom/public)
    const onMessageReceived = (payload) => {
        console.log(`%c Payload `, "color: green", JSON.parse(payload.body));
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "MESSAGE":
                publicChats.push(payloadData.senderName + ": " + payloadData.message);
                setPublicChats([...publicChats]);
                return publicChats;
            default:
                console.error('onMessage - status did not match');
                break;
        }
    }

    const onError = (err) => {
        console.log('alert');
        alert('Server is not currently running! ', err);
    }

    const handleMessage = (event) => { //updates chat message during typing
        const value = event.target.value;
        setUserData({ ...userData, "message": value });
        return value;
    }

    const sendValue = () => { // send message to chat
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            stompClient.send("/app/message.receiveMessage", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, "message": "" });
        }
    }

    const sendTestValue = (gameInfo) => {
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                gameInfo: gameInfo,
                sessionID: userData.sessionID,
                message: "THIS IS A TEST",
                status: "TEST"
            };
            stompClient.send("/app/game.message", {}, JSON.stringify(chatMessage));
        }
    }


    const handleUsername = (event) => { //updates username while typing
        const value = event.target.value;
        setUserData({ ...userData, username: value });
        return value;
    }

    const setUsername = (username) => {
        setUserData({ ...userData, username: username });
    }

    // used to determine if player has placed ships and is ready to move on
    const sendReady = () => {
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                ships: ships,
                sessionID: userData.sessionID,
                player: playerNumber,
                status: "READY"
            }
            stompClient.send(`/app/game.message`, {}, JSON.stringify(chatMessage));
        }
    }

    const sendShot = (shotIndex) => {
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                shot: shotIndex,
                sessionID: userData.sessionID,
                board: board,
                player: playerNumber,
                status: "SHOT"
            }
            stompClient.send(`/app/game.message`, {}, JSON.stringify(chatMessage));
        }
    }

    //runs on game creation via creategamedialogbox
    const sendGameInfo = (gameInfo) => {
        if (stompClient) {
            let message = {
                senderName: userData.username,
                gameInfo: gameInfo,
                player: playerNumber,
                status: "GAME_INFO"
            }
            setUserData({ ...userData, sessionID: gameInfo.sessionID });
            //Spring
            let gameSubscription = stompClient.subscribe(`/game/${gameInfo.sessionID}`, onGameMessageReceived);
            //Rabbit
            // let gameSubscription = stompClient.subscribe(`/topic/game-${gameInfo.sessionID}`, onGameMessageReceived);
            subscriptions.current[3] = gameSubscription;
            stompClient.send("/app/message.gameCreated", {}, JSON.stringify(message));
        }
    }

    //subscribes user to game channel and sends update to server
    const subscribeAndSendToGameChannel = (sessionID) => {
        if (stompClient) {
            setUserData({ ...userData, sessionID: sessionID });

            let message = {
                senderName: userData.username,
                sessionID: sessionID,
                status: "SUBSCRIBE",
            }
            //Spring
            let gameSubscription = stompClient.subscribe(`/game/${sessionID}`, onGameMessageReceived);
            //Rabbit
            // let gameSubscription = stompClient.subscribe(`/topic/game-${sessionID}`, onGameMessageReceived);
            subscriptions.current[3] = gameSubscription;
            stompClient.send("/app/game.addToSubscriberList", {}, JSON.stringify(message));
        }
    }

    //subscribes user to game channel and notifies channel of join
    const subscribeToGameChannel = (sessionID) => {
        if (stompClient) {

            let message = {
                senderName: userData.username,
                sessionID: sessionID,
                status: "JOIN",
            }

            setUserData({ ...userData, sessionID: sessionID });
            //Spring
            let gameSubscription = stompClient.subscribe(`/game/${sessionID}`, onGameMessageReceived);
            //Rabbit
            // let gameSubscription = stompClient.subscribe(`/topic/game-${sessionID}`, onGameMessageReceived);
            subscriptions.current[3] = gameSubscription;

            //Spring
            stompClient.send(`/game/${sessionID}`, {}, JSON.stringify(message));
            //Rabbit
            // stompClient.send(`/topic/game-${sessionID}`, {}, JSON.stringify(message));
        }
    }

    //unsubscribes user from game channel and notifies channel of leave, also clears data
    const unsubscribeFromGameChannel = (text) => {
        if (stompClient) {
            if (text == 'surrender') {
                let message = {
                    senderName: userData.username,
                    sessionID: userData.sessionID,
                    message: `${userData.username} has surrendered!`,
                    status: "LEAVE_SURRENDER",
                }
                //Spring
                stompClient.send(`/game/${userData.sessionID}`, {}, JSON.stringify(message));
                //Rabbit
                // stompClient.send(`/topic/game-${userData.sessionID}`, {}, JSON.stringify(message));
            } else if (text == 'win') {
                let message = {
                    senderName: userData.username,
                    sessionID: userData.sessionID,
                    message: `${userData.username} has won by the button!`,
                    status: "LEAVE_WIN",
                }
                //Spring
                stompClient.send(`/game/${userData.sessionID}`, {}, JSON.stringify(message));
                //Rabbit
                // stompClient.send(`/topic/game-${userData.sessionID}`, {}, JSON.stringify(message));
            }
            clearMatchDataFromWSState();
            subscriptions.current[3].unsubscribe();//Spring
        }
    }

    //sends gamelist to update server and client
    const sendUpdateGameList = (gameList) => {
        if (stompClient) {
            let message = {
                senderName: userData.username,
                gameList: gameList,
                message: "Updating game list",
                status: "GAME_INFO",
            }
            stompClient.send("/app/message.gamePlayerUpdate", {}, JSON.stringify(message));
        }
    }

    //remove game from websocket server game list
    const removeGameFromGameList = (sessionID) => {
        if (stompClient) {
            let message = {
                senderName: userData.username,
                sessionID: sessionID,
                message: "Remove game from list",
                status: "GAME_INFO",
            }
            stompClient.send("/app/game.removeGame", {}, JSON.stringify(message));
        }
    }

    const clearMatchDataFromWSState = () => {
        setUserData({ ...userData, sessionID: null })
        setOpponentName(null);
        setIsOpponentReady(false);
        setIsReady(false);
        setOpponentShips([]);
        setOpponentShot(null);
        setHasSurrendered(false);
        setHasPressWinButton(false);
    }

    let ws = {
        socket,
        stompClient,
        connected,
        registerUser,
        setUsername,
        setUserData,
        connect,
        onConnected,
        onMessageReceived,
        onError,
        handleMessage,
        sendValue,
        handleUsername,
        sendReady,
        publicChats,
        activeUsers,
        userData,
        isReady,
        isOpponentReady,
        opponentShips,
        sendShot,
        sendGameInfo,
        gameList,
        setGameList,
        sendUpdateGameList,
        subscribeToGameChannel,
        subscribeAndSendToGameChannel,
        unsubscribeFromGameChannel,
        sendTestValue,
        opponentName,
        setOpponentName,
        hasSurrendered,
        hasPressWinButton,
        removeGameFromGameList,
        clearMatchDataFromWSState,
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}


export default WebSocket;