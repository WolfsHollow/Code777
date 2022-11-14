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
    selectIsGameOver,
    selectQuestionHistory

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
    const questionHistory = useAppSelector(selectQuestionHistory);
    const [reset, setReset] = useState(false);

    const tableEndRef = useRef(null);

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


    const scrollToBottom = () => {
        tableEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    useUpdateEffect(() => {
        if (isGameOver) {
            console.log('GAME IS OVER!')
        }
    }, [isGameOver])



    useUpdateEffect(() => {
        scrollToBottom();
    }, [questionHistory])

    return (
        <div className='gameplay'>
            <Question question={questionNumber} />
            <div className='playerBoardContainer'>
                {playerContainerList}
            </div>
            <div className='chat'>
                <table>
                    <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Asker</th>
                    </tr>
                    {questionHistory.map((val, key) => {
                        let color = ''
                        if (key % 2 === 0) {
                            color = 'royalblue'
                        }
                        return (
                            <tr style={{ backgroundColor: color }} key={key}>
                                <td>{val[0]}</td>
                                <td className='td-question'>{val[1]}</td>
                                <td>{val[2]}</td>
                                <td>{val[3]}</td>
                            </tr>
                        )
                    })}
                </table>
                <div ref={tableEndRef}></div>
            </div>
            <div className='numberNoteCardContainer'>
                <UserPlayerContainer />
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
