import React, { useState } from 'react'
import { getRandomNumber } from '../utilities/helpers'
import Button from '../components/Button'
import Question from '../components/Question'
import { questionList } from '../components/questionList'

const Homepage = () => {

    const instructions = `
    1. Click on the CREATE ROOM button.\n
    2. Select the preferred game settings and start the game.\n
    3. Connect with your friends using your favorite audio or video chat.\n
    4. Share the room URL with your friends.\n
    5. Enjoy the game!\n
    `;

    return (
        <div className='homepage changeAnimation'>
            <h3>CODE 777</h3>
            <Button text='Create Room' routesTo='room/create' />
            <div>
                <p>How to play:</p>
                <hr />
                <span style={{ whiteSpace: "pre-wrap" }}>{instructions}</span>
            </div>

        </div>
    )
}

export default Homepage
