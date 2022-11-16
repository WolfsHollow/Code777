import React, { useContext, useRef } from 'react'
import { TYPE } from '../data/constants'
import { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { getQuestionAnswer } from '../utilities/getQuestionAnswer'
import { getRandomNumber } from '../utilities/helpers'
import Button from './Button'
import { getNewQuestion, selectNumPlayers, selectPlayerHands, selectPlayers, selectPlayerTurn, selectQuestionAnswer, selectQuestionBank, selectUsername, selectUserPlayerNumber, startNextTurn, updateQuestionHistory } from './gameStateSlice'
import { questionList } from './questionList'
import { WebSocketContext } from './WebSocketComponent'

type props = {
    question: number,
}

const Question = ({ question }: props) => {

    const dispatch = useAppDispatch();
    const ws = useContext(WebSocketContext);

    const playerHands = useAppSelector(selectPlayerHands);
    const playerTurn = useAppSelector(selectPlayerTurn);
    const numPlayers = useAppSelector(selectNumPlayers);
    const userPlayerNumber = useAppSelector(selectUserPlayerNumber);
    const username = useAppSelector(selectUsername);
    const players = useAppSelector(selectPlayers);
    const answer = useAppSelector(selectQuestionAnswer)

    // let answer = getQuestionAnswer(question, numPlayers, playerHands, playerTurn);

    //for solo play
    const newQuestion = () => {
        dispatch(startNextTurn());
    }

    //for server play
    const handleNewQuestion = () => {
        let nextPlayer = playerTurn + 1 > numPlayers - 1 ? 0 : playerTurn + 1;
        if (nextPlayer === userPlayerNumber) {
            // dispatch(updateQuestionHistory([`Q${question}`, answer, players[playerTurn]]))
            ws.sendMessage(username, TYPE.NEXT_QUESTION, 'NEXT QUESTION')
        }
        else console.error('YOU ARE NOT THE NEXT PLAYER')
    }



    return (
        <div className='questionBox'>
            <div className='startInstructions questionText'>{questionList[question]}</div>
            <div className='startInstructions answerText'>{answer}
                <Button text='Next Question' className='button button-glow questionButton' onClick={handleNewQuestion} /></div>
        </div>
    )
}

export default Question
