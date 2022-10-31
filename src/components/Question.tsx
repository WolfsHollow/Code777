import React, { useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { getQuestionAnswer } from '../utilities/getQuestionAnswer'
import { getRandomNumber } from '../utilities/helpers'
import Button from './Button'
import { getNewQuestion, selectNumPlayers, selectPlayerHands, selectPlayers, selectPlayerTurn, startNextTurn } from './gameStateSlice'
import { questionList } from './questionList'

type props = {
    question: number,
}

const Question = ({ question }: props) => {

    const dispatch = useAppDispatch();

    const playerHands = useAppSelector(selectPlayerHands);
    const playerTurn = useAppSelector(selectPlayerTurn);
    const numPlayers = useAppSelector(selectNumPlayers);

    let answer = getQuestionAnswer(question, numPlayers, playerHands, playerTurn);


    const newQuestion = () => {
        dispatch(startNextTurn());
    }

    return (
        <div className='questionBox'>
            <p>{questionList[question]}</p>
            <p>{answer}</p>
            <Button text='Next Question' onClick={newQuestion} />
        </div>
    )
}

export default Question
