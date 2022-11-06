import { v4 as uuidv4 } from 'uuid';
import { WebSocketServer } from 'ws';
import { DECK, QUESTION_BANK, TYPE } from './constants.js'
import { shuffle } from './helpers.js';

const wss = new WebSocketServer({ port: 8082 });

const rooms = {};
const roomData = {};
const USER_LIST = 'userList';
const roomClients = {};

wss.on("connection", socket => {
    let user;

    const broadcastToRoom = (roomID, message) => {
        Object.keys(roomClients[roomID]).forEach(client => {
            roomClients[roomID][client].send(message)
        })
    }

    const initializeGame = (roomID) => {
        let deck = roomData[roomID]['deck'];
        let questionList = roomData[roomID]['questionBank'];
        let players = rooms[roomID];

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
            payload: rooms[roomID],
        }

        broadcastToRoom(roomID, JSON.stringify(message));
    }

    const subscribe = (roomID, userID) => {
        user = userID;
        // create room if doesn't exist
        if (!rooms[roomID]) {
            rooms[roomID] = {};
            roomData[roomID] = {};
            roomClients[roomID] = {};

            //initialize data
            if (roomID !== USER_LIST) {
                let deck = shuffle(DECK);
                let questionList = shuffle(QUESTION_BANK)

                roomData[roomID]['deck'] = deck;
                roomData[roomID]['questionBank'] = questionList;
            }
        }
        //add user to room
        if (!rooms[roomID][userID]) {

            rooms[roomID][userID] = -1; // add player and playerNumber
            roomClients[roomID][userID] = socket; // add client to list

            if (roomID !== USER_LIST) {
                sendPlayerData(roomID);
            }
        }
    }

    const leave = (array, roomID, userID) => {
        // not present: do nothing
        if (!array[roomID][userID]) return;

        // if the one exiting is the last one, destroy the roomID
        if (Object.keys(array[roomID]).length === 1) {
            delete array[roomID];
            if (roomData[roomID]) delete roomData[roomID];
        }

        // otherwise simply leave the roomID
        else delete array[roomID][userID];
    };


    socket.on('message', (data, isBinary) => {
        let message = isBinary ? data : data.toString();

        console.log('message received', message);
        let { sender, type, payload } = JSON.parse(message);

        switch (type) {
            case TYPE.JOIN:
                // user = payload;
                console.log(type)
                break;
            case TYPE.LEAVE:
                leave(payload, sender)
                break;
            case TYPE.GUESS:

                break;
            case TYPE.NEXT_QUESTION:
                break;
            case TYPE.LOBBY_INFO:
                break;
            case TYPE.SUBSCRIBE:
                subscribe(payload, sender) //room id, sender
                sendPlayerData(payload) //room id
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
        Object.keys(rooms).forEach(room => leave(rooms, room, user));
        Object.keys(roomClients).forEach(room => leave(roomClients, room, user));

        console.log('someone left', user);
    });
});