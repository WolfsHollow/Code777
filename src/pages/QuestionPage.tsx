import React, { useEffect, useRef, useState } from 'react'
import { getRandomNumber, shuffle } from '../utilities/helpers'
import Button from '../components/Button'
import Question from '../components/Question'
import { questionList } from '../components/questionList'
import { QUESTION_BANK } from '../data/constants'


const initialState = {
    questionBank: shuffle(QUESTION_BANK)
}

const QuestionPage = () => {

    const [questionNumber, setQuestionNumber] = useState(0);
    const questions = useRef(initialState);

    const newQuestion = () => {
        setQuestionNumber(questions.current.questionBank.shift());
        console.log(questions.current.questionBank.length)
        if (questions.current.questionBank.length === 0) {
            questions.current.questionBank = shuffle(QUESTION_BANK);
            console.log('shuffled!');
        }
        console.log(questions.current.questionBank);
    }

    useEffect(() => {
        setQuestionNumber(questions.current.questionBank.shift());
    }, [])

    return (
        <div className='homepage changeAnimation'>
            <div className='questionBox'>
                <p>{questionList[questionNumber]}</p>
            </div>
            <Button text='Next Question' onClick={newQuestion} />
        </div>
    )
}

export default QuestionPage
