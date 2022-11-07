import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';
import { DECK, QUESTION_BANK, TYPE } from './constants.js'
import { shuffle } from './helpers.js';
import { RoomData } from './RoomData.js';

const wss = new WebSocketServer({ port: 8082 });

const rooms = {}; // {roomID: {player: playerNumber}}
const roomData = {}; // {roomID: {deck:deck, questions: questions, players: [players]}}
const USER_LIST = 'userList';

wss.on("connection", socket => {
    let user;
    let roomsJoined = [];

    const broadcastToRoom = (roomID, message) => {
        if (rooms[roomID]) {
            Object.entries(rooms[roomID].clients).forEach(([userID, client]) => {
                // if (userID !== user) {
                client.send(message)
                // }
            })
        }
    }

    const initializeGame = (roomID) => {

        let deck = roomData[roomID].deck;
        let questionList = roomData[roomID].questions;
        let players = rooms[roomID].players;

        let message = {
            sender: user,
            type: TYPE.INITIALIZE_GAME,
            payload: { deck, questionList, players },
        }
        broadcastToRoom(roomID, JSON.stringify(message));
    }

    const sendPlayerData = (roomID) => {
        let message = {
            sender: user,
            type: TYPE.LOBBY_INFO,
            payload: rooms[roomID].players,
        }

        broadcastToRoom(roomID, JSON.stringify(message));
    }

    const subscribe = (roomID, userID) => {
        user = userID;
        // create room if doesn't exist
        if (!rooms[roomID]) {
            rooms[roomID] = new RoomData(roomID);
        }

        //add user to room
        if (!rooms[roomID][userID]) {

            rooms[roomID].add(user, socket);

            roomsJoined.push(roomID)

            sendPlayerData(roomID);
        }
    }

    socket.on('message', (data, isBinary) => {
        let message = isBinary ? data : data.toString();

        console.log('message received', message);
        let { sender, userID, roomID, type, payload } = JSON.parse(message);

        switch (type) {
            case TYPE.JOIN:
                // user = payload;
                console.log('user joined')
                break;
            case TYPE.GUESS:

                break;
            case TYPE.NEXT_QUESTION:
                break;
            case TYPE.LOBBY_INFO:
                rooms[roomID].players = payload;
                broadcastToRoom(roomID, message)
                break;
            case TYPE.SUBSCRIBE:
                subscribe(payload, sender) //room id, sender
                break;
            case TYPE.MESSAGE:
                console.log('there was a message', payload);
                break;
            default:
                console.log('problem with type');
                break;
        }
    })


    socket.on("close", () => {
        // for each room, remove the closed socket
        console.log(user, ' left');

        roomsJoined.forEach(room => {
            let isEmpty = rooms[room].remove(user);
            sendPlayerData(room)
            if (isEmpty) delete rooms[room]
        })
    });
});