import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DECK, PLAYER, QUESTION_BANK } from '../data/constants';
import { getRandomNumber, shuffle } from '../utilities/helpers';

interface gameState {
    deck: Array<string>,
    playerTurn: number,
    currentQuestion: number,
    players: Array<string>,
    userPlayerNumber: number,
    numPlayers: number,
    playerHands: Array<Array<string>>,
    questionBank: Array<number>
}

const initialState: gameState = {
    deck: DECK,
    playerTurn: 0,
    currentQuestion: 0,
    players: [PLAYER.ONE, PLAYER.TWO, PLAYER.THREE, PLAYER.FOUR],
    userPlayerNumber: 0,
    numPlayers: 4,
    playerHands: [['??', '??', '??'], ['??', '??', '??'], ['??', '??', '??'], ['??', '??', '??']],
    questionBank: QUESTION_BANK,
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
        updateDeck: (state, { payload }: PayloadAction<Array<string>>) => {
            state.deck = payload;
            console.log('deck updated');
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
        makeQuestionBankList: (state, { payload }: PayloadAction<Array<number>>) => {
            state.questionBank = shuffle(QUESTION_BANK);
            console.log('question bank updated');
        },
        updateNumPlayers: (state, { payload }: PayloadAction<number>) => {
            state.numPlayers = payload;
        },
        updatePlayerHands: (state, { payload }: PayloadAction<[Array<number>, Array<Array<string>>]>) => {
            let player = payload[0];
            let hand = payload[1];
            let newHands = state.playerHands;

            for (let index in player) {
                newHands[index] = hand[index]
            }

            state.playerHands = newHands;
            console.log(`${player} -- hands updated`)
        },
        updatePlayers: (state, { payload }: PayloadAction<Array<string>>) => {
            state.players = payload;
            console.log(`current players ${payload}`);
        },
        resetState: (state, action) => {
            return {// reset everything other than login info
                ...state,
            }
        }
    }
});

export const { changePlayer, makeQuestionBankList, updatePlayerHands, updatePlayers,
    resetState, dealCards, getNewQuestion, startNextTurn
} = gameStateSlice.actions;

export const selectDeck = (state) => state.gameState.deck;
export const selectPlayerTurn = (state) => state.gameState.playerTurn;
export const selectPlayers = (state) => state.gameState.players;
export const selectPlayerHands = (state) => state.gameState.playerHands;
export const selectQuestionBank = (state) => state.gameState.questionBank;
export const selectCurrentQuestion = (state) => state.gameState.currentQuestion;
export const selectNumPlayers = (state) => state.gameState.numPlayers;

export default gameStateSlice.reducer;
