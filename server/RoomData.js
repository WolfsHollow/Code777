import { DECK, QUESTION_BANK } from "./constants.js"
import { shuffle } from "./helpers.js"

export class RoomData {
    roomID;
    players;
    playersInRoom;
    deck;
    questions;
    clients;

    constructor(roomID) {
        this.roomID = roomID;
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

        if (Object.keys(this.clients).length === 0) return true;

        return false;

    }


}