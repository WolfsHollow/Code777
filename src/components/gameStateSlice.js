import { createSlice } from '@reduxjs/toolkit';
import { DECK, PLAYER } from '../data/constants';

const initialState = {
    deck: null,
    playerTurn: PLAYER.ONE,
    players: [],
    playerHands: [[], [], [], []],
    questionBank: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],


};

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        updateShips: (state, action) => {
            // console.log("ship positions", action.payload)
            state.ships = action.payload;
            sessionStorage.setItem("localShipPositions", JSON.stringify(action.payload))
        },
        resetState: (state, action) => {
            return {// reset everything other than login info
                ...state,
            }
        }
    }
});

export const { updateShips } = gameStateSlice.actions;

export const selectBoard = (state) => state.gameState.board;


export default gameStateSlice.reducer;
