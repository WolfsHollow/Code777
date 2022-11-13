import React, { useContext, useEffect, useRef, useState } from 'react'
import PlayerContainer from '../components/PlayerContainer'
import Question from '../components/Question'
import Number from '../components/Number'
import { NUMBERS, TYPE } from '../data/constants'
import {
    selectPlayerHands,
    selectPlayers,
    selectPlayerTurn,
    selectCurrentQuestion,
    selectUserPlayerNumber,
    selectGuessNumbers,
    madeGuess,
    selectUsername,
    selectIsGameOver

} from '../components/gameStateSlice'
import useUpdateEffect, { useAppDispatch, useAppSelector } from '../hooks/customHook'
import UserPlayerContainer from '../components/UserPlayerContainer'
import Button from '../components/Button'
import { WebSocketContext } from '../components/WebSocketComponent'

const Game = () => {

    const dispatch = useAppDispatch();
    const ws = useContext(WebSocketContext);

    const players = useAppSelector(selectPlayers);
    const playerHands = useAppSelector(selectPlayerHands);
    const playerTurn = useAppSelector(selectPlayerTurn);
    const questionNumber = useAppSelector(selectCurrentQuestion);
    const userPlayerNumber = useAppSelector(selectUserPlayerNumber);
    const guessNumbers = useAppSelector(selectGuessNumbers);
    const username = useAppSelector(selectUsername);
    const isGameOver = useAppSelector(selectIsGameOver);

    const [reset, setReset] = useState(false);
    const [questionHistory, setQuestionHistory] = useState([]);

    const getOpponentArray = () => {
        let opponentPlayers = [0, 1, 2, 3];
        opponentPlayers = opponentPlayers.filter(index => index !== userPlayerNumber && index < players.length)
        return opponentPlayers
    }

    const initialState = {
        opponentArray: getOpponentArray()
    }

    const playerArray = useRef(initialState);


    const numberDivs = NUMBERS.map((entry: [string, number, string], index: number) =>
        <Number color={entry[0]} value={entry[1]} grid={entry[2]} key={index} reset={reset} />
    )

    const playerContainerList = playerArray.current.opponentArray.map((player, index) => {
        return <PlayerContainer playerName={players[player]}
            cards={playerHands[player]}
            playerNumber={player}
            key={players[player]} />
    })

    const handleReset = () => {
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 100)
    }

    const submitGuess = () => {
        if (guessNumbers.length === 3) {
            let userHand = playerHands[userPlayerNumber];
            let handNumbers = userHand.map(card => card[1]);
            let guessNumbersOnly = guessNumbers.map(card => card[1]);
            console.log(guessNumbersOnly, handNumbers);

            let unionArray = handNumbers.map(number => {
                let index = guessNumbersOnly.indexOf(number)
                if (index === -1) {
                    guessNumbersOnly.splice(index, 1)
                }
                return index
            })
            let isCorrect = false;

            if (guessNumbersOnly.length === 3) {
                isCorrect = true;
            }
            //solo
            // dispatch(madeGuess(isCorrect))

            //server
            ws.sendMessage(username, TYPE.GUESS, [isCorrect, userPlayerNumber])
        }
    }


    useUpdateEffect(() => {
        if (isGameOver) {
            console.log('GAME IS OVER!')
        }
    }, [isGameOver])

    return (
        <div className='gameplay'>
            <Question question={questionNumber} />
            <div className='playerBoardContainer'>
                {playerContainerList}
            </div>
            <div className='chat'>
                <span>
                    Current Player Turn {playerTurn}
                </span>
                <br />
                <span>
                    players {players}

                </span>
            </div>
            <div className='numberNoteCardContainer'>
                <div className='editButtons'>
                    <UserPlayerContainer />
                </div>
                <div className='numberNoteCard'>
                    <Button text='Reset' onClick={handleReset} buttonStyle={{ gridArea: "3/2/3/4" }} />
                    <Button text='Submit' onClick={submitGuess} buttonStyle={{ gridArea: "3/12/3/14" }} />
                    {numberDivs}
                </div>
            </div>
        </div>
    )
}

export default Game
