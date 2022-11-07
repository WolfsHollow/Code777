import { DECK, QUESTION_BANK } from "./constants"
import { shuffle } from "./helpers"

export class RoomData {
    roomID;
    players;
    deck;
    questions;
    clients;

    constructor(roomID) {
        this.roomID = roomID;
        this.players = [];
        this.clients = {};
        this.deck = shuffle(DECK);
        this.questions = shuffle(QUESTION_BANK);
    }
}