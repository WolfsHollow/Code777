import React, { useState } from 'react'
import { getRandomNumber } from '../utilities/helpers'
import Button from '../components/Button'
import Question from '../components/Question'
import { questionList } from '../components/questionList'

const Homepage = () => {

    const [questionNumber, setQuestionNumber] = useState(getRandomNumber(23));

    const newQuestion = () => {
        setQuestionNumber(getRandomNumber(23));
    }

    return (
        <div className='homepage changeAnimation'>
            <Question question={questionNumber} />
            <Button text='Next Question' onClick={newQuestion} />
        </div>
    )
}

export default Homepage
