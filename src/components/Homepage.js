import React, { useState } from 'react'
import { getRandomNumber } from '../helpers'
import Button from './Button'
import Question from './Question'
import { questionList } from './questionList'

const Homepage = () => {

    const [questionNumber, setQuestionNumber] = useState(getRandomNumber(23));

    console.log(questionNumber);

    const newQuestion = () => {
        setQuestionNumber(getRandomNumber(23));
    }

    return (
        <div className='homepage changeAnimation'>
            <Question question={`Q${questionNumber}`} />
            <Button text='Next Question' onClick={newQuestion} />
        </div>
    )
}

export default Homepage
