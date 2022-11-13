import { DECK, QUESTION_BANK, TYPE } from "./constants.js"
import { shuffle } from "./helpers.js"

export class RoomData {
    roomID;
    host;
    players;
    playersInRoom;
    deck;
    questions;
    clients;
    scores;
    hands;
    discardPile;

    constructor(roomID, user) {
        this.roomID = roomID;
        this.host = user;
        this.players = []
        this.playersInRoom = {};
        this.clients = {};
        this.deck = shuffle(DECK);
        this.questions = shuffle(QUESTION_BANK);
        this.scores = [0, 0, 0, 0];
        this.discardPile = [];
        this.hands = [[['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']]];
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

    nextQuestion(message) {
        if (this.questions.length === 0) {
            this.questions = shuffle(QUESTION_BANK);
        }
        let newQuestionList = [this.questions];
        let nextQuestion = newQuestionList.shift();

        this.questions = newQuestionList;

        let newMessage = { ...message, payload: nextQuestion }

        return JSON.stringify(newMessage);
    }

    madeGuess([isCorrect, userPlayerNumber], message) {
        let isGameOver = false;
        if (isCorrect) {
            this.scores[userPlayerNumber]++;
            if (this.scores[userPlayerNumber] === 3) {
                isGameOver = true;
            }
        }
        else console.log('the guess was incorrect!');

        this.discardPile.push(...this.hands[userPlayerNumber]);

        let newDeck = [...this.deck];
        let newHand = newDeck.splice(0, 3);

        if (newDeck.length <= 7) {
            newDeck = shuffle(this.discardPile)
            this.discardPile = [];
        }

        this.hands[userPlayerNumber] = newHand;
        this.deck = newDeck;

        let newMessage = {
            ...message,
            payload: {
                'isCorrect': isCorrect,
                'deck': newDeck,
                'hands': this.hands,
                'discard': this.discardPile,
                'scores': this.scores,
                'isGameOver': isGameOver,
            }
        }

        return JSON.stringify(newMessage);
    }

    startGame(message) {

        Object.entries(this.playersInRoom).forEach(([user, index]) =>
            this.players[index] = user
        )

        let newDeck = this.deck;
        let newQuestionList = this.questions;
        let newHands = this.hands;

        for (let i = 0; i < this.players.length; i++) {
            newHands[i] = newDeck.splice(0, 3);
        }

        let payloadToSend = {
            'deck': newDeck,
            'questions': newQuestionList,
            'hands': newHands,
            'players': this.players,
        };

        let newMessage = {
            ...message,
            payload: payloadToSend,
        }

        return JSON.stringify(newMessage);
    }

}