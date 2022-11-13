import { DECK, QUESTION_BANK } from "./constants.js"
import { shuffle } from "./helpers.js"

export class RoomData {
    roomID;
    host;
    players;
    playersInRoom;
    deck;
    questions;
    clients;

    constructor(roomID, user) {
        this.roomID = roomID;
        this.host = user;
        this.players = []
        this.playersInRoom = {};
        this.clients = {};
        this.deck = shuffle(DECK);
        this.questions = shuffle(QUESTION_BANK);
    }

    add(user, socket) {
        this.playersInRoom[user] = -1;
        this.clients[user] = socket;
    }

    remove(user) {
        delete this.playersInRoom[user]
        delete this.clients[user];

        // change host if needed
        if (this.host === user && Object.keys(this.clients).length !== 0) {
            let newHost = Object.keys(this.clients)[0];
            this.host = newHost;
            console.log('new host is ', newHost)
        }

        //return if room should be deleted
        if (Object.keys(this.clients).length === 0) return true;

        return false;

    }

    setPlayers() {
        Object.entries(this.playersInRoom).forEach(([user, index]) =>
            this.players[index] = user
        )
    }


}