import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useContext } from 'react';
import { DECK, PLAYER, QUESTION_BANK } from '../data/constants';
import { getQuestionAnswer } from '../utilities/getQuestionAnswer';
import { getRandomNumber, shuffle } from '../utilities/helpers';
import { questionList, shortQuestionList } from './questionList';
import { WebSocketContext } from './WebSocketComponent';

interface gameState {
    deck: [string, number][],
    discardPile: [string, number][],
    playerTurn: number,
    currentQuestion: number,
    players: Array<string>,
    username: string,
    userPlayerNumber: number,
    numPlayers: number,
    playerHands: Array<Array<[string, '?' | number]>>,
    guessNumbers: Array<[string, string | number]>,
    questionBank: Array<number>,
    questionHistory: Array<[string, string, string | number, string]>,
    questionAnswer: number | string;
    playerScores: Array<number>,
    isGameOver: boolean,
    test: string,
}

const initialState: gameState = {
    deck: DECK,
    discardPile: [],
    playerTurn: 0,
    currentQuestion: 0,
    players: [null, null, null, null],
    username: 'Player One',
    userPlayerNumber: 0,
    numPlayers: 1,
    playerHands: [[['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']]],
    guessNumbers: [],
    questionBank: QUESTION_BANK,
    questionHistory: [],
    questionAnswer: null,
    playerScores: [0, 0, 0, 0],
    isGameOver: false,
    test: 'test',
};

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        changePlayer: (state, action: PayloadAction<number>) => {
            let playerIndex = state.playerTurn;
            playerIndex++;
            if (playerIndex === state.players.length) {
                playerIndex = 0;
            }
            state.playerTurn = playerIndex;
        },
        dealCards: (state, action: PayloadAction<number>) => {
            let newDeck = shuffle(DECK)
            let newHands = state.playerHands;
            for (let i = 0; i < state.players.length; i++) {
                newHands[i] = newDeck.splice(0, 3);
            }
            state.playerHands = newHands;
            state.deck = newDeck;
        },
        updateDeck: (state, { payload }: PayloadAction<Array<[string, number]>>) => {
            state.deck = payload;
        },
        gameOver: (state, { payload }: PayloadAction<string>) => {
            console.log(`${payload} wins!`)
        },
        getNewQuestion: (state, { payload }: PayloadAction<number>) => {
            if (state.questionBank.length === 0) {
                state.questionBank = shuffle(QUESTION_BANK);
            }
            let newQuestionList = [...state.questionBank];
            let nextQuestion = newQuestionList.shift();

            state.currentQuestion = nextQuestion;
            state.questionBank = newQuestionList;
        },
        startGame: (state, { payload }: PayloadAction<Object>) => {
            // payload:  deck, questionlist, hands, players

            // reset state to initial
            state.playerTurn = 0;
            state.playerScores = [0, 0, 0, 0];
            state.questionHistory = [];

            // load into state
            state.questionBank = payload['questions'];
            state.currentQuestion = payload['currentQuestion'];
            state.questionAnswer = payload['questionAnswer'];
            state.players = payload['players'];
            state.numPlayers = payload['players'].length;
            state.playerHands = payload['hands']
            state.deck = payload['deck'];
        },
        startNextTurn: (state, { payload }: PayloadAction<number>) => {

            // get next question
            //solo
            // if (state.questionBank.length === 0) {
            //     state.questionBank = shuffle(QUESTION_BANK);
            // }
            // let newQuestionList = [...state.questionBank];
            // let nextQuestion = newQuestionList.shift();
            // state.currentQuestion = nextQuestion;
            // state.questionBank = newQuestionList;

            state.questionHistory.push([`Q${state.currentQuestion}`, shortQuestionList[state.currentQuestion], state.questionAnswer, state.players[state.playerTurn]])

            state.currentQuestion = payload;


            // change player
            let playerIndex = state.playerTurn;
            playerIndex++;
            if (playerIndex === state.players.length) {
                playerIndex = 0;
            }
            state.playerTurn = playerIndex;
            let newAnswer = getQuestionAnswer(payload, state.numPlayers, state.playerHands, state.playerTurn);
            state.questionAnswer = newAnswer;
        },
        madeGuess: (state, { payload }: PayloadAction<boolean>) => { //solo

            if (payload) {
                console.log('the guess was correct!');
                state.playerScores[state.userPlayerNumber]++;
            }
            else console.log('the guess was incorrect!');

            let newDeck = [...state.deck];
            let newHand = newDeck.splice(0, 3);
            state.playerHands[state.userPlayerNumber] = newHand;
            state.deck = newDeck;
        },
        receiveGuess: (state, { payload }: PayloadAction<Object>) => { //server
            // payload: object {deck, hands, scores}
            if (payload['isCorrect']) {
                console.log('the guess was right!');
            }
            else console.log('the guess was wrong!');

            state.deck = payload['deck'];
            state.playerHands = payload['hands'];
            state.playerScores = payload['scores'];
            state.discardPile = payload['discard'];
            state.isGameOver = payload['isGameOver'];
        },
        makeQuestionBankList: (state, { payload }: PayloadAction<Array<number>>) => {
            state.questionBank = shuffle(QUESTION_BANK);
        },
        addGuessNumber: (state, { payload }: PayloadAction<[string, number]>) => {
            console.log('payload', payload)
            state.guessNumbers.push(payload)
        },
        removeGuessNumber: (state, { payload }: PayloadAction<number>) => {
            console.log(payload);
            state.guessNumbers.splice(payload, 1);
        },
        resetNumberCard: (state, { payload }: PayloadAction<number>) => {
            state.guessNumbers = [];
        },
        updateUserPlayerNumber: (state, { payload }: PayloadAction<number>) => {
            state.userPlayerNumber = payload;
        },
        updatePlayerHands: (state, { payload }: PayloadAction<[Array<number>, Array<Array<string>>]>) => {
            // let player = payload[0];
            // let hand = payload[1];
            // let newHands = state.playerHands;

            // for (let index in player) {
            //     newHands[index] = hand[index]
            // }

            // state.playerHands = newHands;
            // console.log(`${player} -- hands updated`)
        },
        updateQuestionHistory: (state, { payload }: PayloadAction<[string, string, string | number, string]>) => {
            state.questionHistory.push(payload);
        },
        updatePlayers: (state, { payload }: PayloadAction<Array<string>>) => {
            state.players = payload;
        },
        updateUsername: (state, { payload }: PayloadAction<string>) => {
            // state.username = payload;
            state.username = payload;
        },
        resetState: (state, action) => {
            return {// reset everything other than login info
                ...state, initialState,
            }
        }
    }
});

export const { changePlayer, makeQuestionBankList, updatePlayerHands, updatePlayers,
    resetState, dealCards, getNewQuestion, startNextTurn, updateUsername, addGuessNumber, removeGuessNumber,
    madeGuess, resetNumberCard, startGame, updateUserPlayerNumber, receiveGuess, updateQuestionHistory
} = gameStateSlice.actions;

export const selectDeck = (state) => state.gameState.deck;
export const selectPlayerTurn = (state) => state.gameState.playerTurn;
export const selectPlayers = (state) => state.gameState.players;
export const selectPlayerHands = (state) => state.gameState.playerHands;
export const selectQuestionBank = (state) => state.gameState.questionBank;
export const selectCurrentQuestion = (state) => state.gameState.currentQuestion;
export const selectNumPlayers = (state) => state.gameState.numPlayers;
export const selectUsername = (state) => state.gameState.username;
export const selectUserPlayerNumber = (state) => state.gameState.userPlayerNumber;
export const selectGuessNumbers = (state) => state.gameState.guessNumbers;
export const selectPlayerScores = (state) => state.gameState.playerScores;
export const selectIsGameOver = (state) => state.gameState.isGameOver;
export const selectTest = (state) => state.gameState.test;
export const selectQuestionHistory = (state) => state.gameState.questionHistory;
export const selectQuestionAnswer = (state) => state.gameState.questionAnswer;

export default gameStateSlice.reducer;
