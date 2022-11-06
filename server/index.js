// import { v4 as uuidv4 } from 'uuid';
// const { TYPE } = require('./constants')

const { v4: uuidv4 } = require('uuid');
const WebSocket = require("ws");


const wss = new WebSocket.Server({ port: 8082 });

const TYPE = {
    JOIN: "join",
    LEAVE: "leave",
    MESSAGE: "message",
    SUBSCRIBE: "subscribe",
    GAME_ACTION: "gameAction",
}

const rooms = {};

wss.on("connection", socket => {


    console.log(TYPE.JOIN);
    let userID = uuidv4(); // create here a uuid for this connection

    const subscribe = (roomID, userID) => {
        rooms[roomID].push(userID);
    }

    socket.on('open', () => {
        subscribe('lobbyChat', userID)
    })


    const join = (roomID, userID) => {
        // create room if doesn't exist
        if (!rooms[roomID]) rooms[rooms] = {};

        //add user to room
        if (!rooms[roomID][userID]) rooms[roomID][userID] = userID;
    }

    const leave = (roomID, userID) => {
        // not present: do nothing
        if (!rooms[roomID][userID]) return;

        // if the one exiting is the last one, destroy the roomID
        if (Object.keys(rooms[roomID]).length === 1) delete rooms[roomID];

        // otherwise simply leave the roomID
        else delete rooms[roomID][userID];
    };


    socket.on('message', (data, isBinary) => {
        let message = isBinary ? data : data.toString();

        let { sender, type, payload } = JSON.parse(message);

        switch (type) {
            case TYPE.JOIN:
                join(payload, sender)
                break;
            case TYPE.LEAVE:
                leave(payload, sender)
                break;
            case TYPE.GAME_ACTION:
                break;
            case TYPE.SUBSCRIBE:
                subscribe(payload, sender)
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
        Object.keys(rooms).forEach(room => leave(room));
    });
});