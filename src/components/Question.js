import React, { useRef } from 'react'
import { questionList } from './questionList'
import { getRandomNumber } from '../helpers'

const Question = ({ question }) => {

    return (
        <div className='QuestionBox'>
            <p>{questionList[question]}</p>
        </div>
    )
}

export default Question
