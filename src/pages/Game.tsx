import React, { useEffect, useRef, useState } from 'react'
import PlayerContainer from '../components/PlayerContainer'
import Question from '../components/Question'
import Number from '../components/Number'
import { NUMBERS } from '../data/constants'
import {
    selectDeck,
    selectPlayerHands,
    selectPlayers,
    selectPlayerTurn,
    selectQuestionBank,
    selectCurrentQuestion,
    updatePlayerHands,
    dealCards,
    changePlayer,
    getNewQuestion,
    makeQuestionBankList

} from '../components/gameStateSlice'
import { useAppDispatch, useAppSelector } from '../hooks/customHook'

const Game = () => {

    const dispatch = useAppDispatch();

    const deck = useAppSelector(selectDeck);
    const players = useAppSelector(selectPlayers);
    const playerHands = useAppSelector(selectPlayerHands);
    const questionBank = useAppSelector(selectQuestionBank);
    const playerTurn = useAppSelector(selectPlayerTurn);
    const currentQuestion = useAppSelector(selectCurrentQuestion);
    const questionNumber = useAppSelector(selectCurrentQuestion);

    const numberDivs = NUMBERS.map((entry: [string, number, string], index: number) =>
        <Number color={entry[0]} value={entry[1]} grid={entry[2]} key={index} />)


    const startGame = () => {
        dispatch(makeQuestionBankList())
        dispatch(dealCards())
        dispatch(getNewQuestion())
    }

    useEffect(() => {
        startGame();
    }, [])

    return (
        <div className='gameplay'>
            <Question question={questionNumber} />
            <div className='playerBoardContainer'>
                <PlayerContainer playerName={players[0]} cards={playerHands[0]} key={'player0'} />
                <PlayerContainer playerName={players[1]} cards={playerHands[1]} key={'player1'} />
                <PlayerContainer playerName={players[2]} cards={playerHands[2]} key={'player2'} />
            </div>
            <div className='chat'></div>
            <div className='numberNoteCardContainer'>
                <div className='editButtons'>
                    <PlayerContainer playerName={players[3]} cards={playerHands[3]} />
                </div>
                <div className='numberNoteCard'>
                    {numberDivs}
                </div>
            </div>
        </div >
    )
}

export default Game
