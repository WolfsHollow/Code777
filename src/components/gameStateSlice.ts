import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useContext } from 'react';
import { DECK, PLAYER, QUESTION_BANK } from '../data/constants';
import { getRandomNumber, shuffle } from '../utilities/helpers';
import { WebSocketContext } from './WebSocketComponent';

interface gameState {
    deck: [string, number][],
    playerTurn: number,
    currentQuestion: number,
    players: Array<string>,
    username: string,
    userPlayerNumber: number,
    numPlayers: number,
    playerHands: Array<Array<[string, string | number]>>,
    guessNumbers: Array<[string, string | number]>,
    questionBank: Array<number>,
    playerScores: Array<number>,
    test: string,
}

const initialState: gameState = {
    deck: DECK,
    playerTurn: 0,
    currentQuestion: 0,
    players: [null, null, null, null],
    username: 'Player One',
    userPlayerNumber: 0,
    numPlayers: 4,
    playerHands: [[['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']], [['?', '?'], ['?', '?'], ['?', '?']]],
    guessNumbers: [],
    questionBank: QUESTION_BANK,
    playerScores: [0, 0, 0, 0],
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
            console.log(`Next player's turn`)
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
            console.log('deck updated');
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
            console.log(`current question is Q${state.currentQuestion}`)
        },
        startGame: (state, { payload }: PayloadAction<Object>) => {
            // payload:  deck, questionlist, players
            let newDeck = payload['deck']
            let newQuestionList = payload['questionList'];
            let newPlayers = payload['players'];

            console.warn(newDeck, newQuestionList, newPlayers);

            state.deck = newDeck;
            state.questionBank = newQuestionList;
            state.players = newPlayers;
        },
        startNextTurn: (state, { payload }: PayloadAction<number>) => {

            // get next question
            if (state.questionBank.length === 0) {
                state.questionBank = shuffle(QUESTION_BANK);
            }
            let newQuestionList = [...state.questionBank];
            let nextQuestion = newQuestionList.shift();

            state.currentQuestion = nextQuestion;
            state.questionBank = newQuestionList;
            console.log(`current question is Q${state.currentQuestion}`)

            // change player
            let playerIndex = state.playerTurn;
            playerIndex++;
            if (playerIndex === state.players.length) {
                playerIndex = 0;
            }
            state.playerTurn = playerIndex;
            console.log(`current player: ${state.playerTurn}`)
        },
        madeCorrectGuess: (state, { payload }: PayloadAction<number>) => {
            state.playerScores[state.userPlayerNumber]++;
            let newDeck = [...state.deck];
            let newHand = newDeck.splice(0, 3);
            state.playerHands[state.userPlayerNumber] = newHand;
            state.deck = newDeck;
        },
        madeIncorrectGuess: (state, { payload }: PayloadAction<number>) => {
            let newDeck = [...state.deck];
            let newHand = newDeck.splice(0, 3);
            state.playerHands[state.userPlayerNumber] = newHand;
            state.deck = newDeck;
        },

        makeQuestionBankList: (state, { payload }: PayloadAction<Array<number>>) => {
            state.questionBank = shuffle(QUESTION_BANK);
            console.log('question bank updated');
        },
        addGuessNumber: (state, { payload }: PayloadAction<[string, number]>) => {
            console.log('payload', payload)
            state.guessNumbers.push(payload)
        },
        removeGuessNumber: (state, { payload }: PayloadAction<number>) => {
            console.log(payload);
            state.guessNumbers.splice(payload, 1);
            console.log('removed number from guessNumber')
        },
        resetNumberCard: (state, { payload }: PayloadAction<number>) => {
            state.guessNumbers = [];
        },
        updateNumPlayers: (state, { payload }: PayloadAction<number>) => {
            state.numPlayers = payload;
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
        updatePlayers: (state, { payload }: PayloadAction<Array<string>>) => {
            console.log(`updating players to ${payload}`)
            state.players = payload;
        },
        updateUsername: (state, { payload }: PayloadAction<string>) => {
            // state.username = payload;
            state.username = payload;
            console.log('Username changed to ', payload);
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
    madeIncorrectGuess, madeCorrectGuess, resetNumberCard, startGame,
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
export const selectTest = (state) => state.gameState.test;

export default gameStateSlice.reducer;
