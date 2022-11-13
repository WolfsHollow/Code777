import React, { useRef, useState } from 'react'
import { getRandomNumber } from '../utilities/helpers'
import Button from '../components/Button'
import Question from '../components/Question'
import { questionList } from '../components/questionList'
import { useAppDispatch } from '../hooks/customHook'
import { updateUsername } from '../components/gameStateSlice'

const Homepage = () => {

    const welcome = `Welcome to Code 777\n
    To continue, please choose a nickname.\n`

    const instructions = `
    1. Click on the CREATE ROOM button.\n
    2. Select the preferred game settings and start the game.\n
    3. Connect with your friends using your favorite audio or video chat.\n
    4. Share the room URL with your friends.\n
    5. Enjoy the game!\n
    `;

    const username = useRef(null);

    const dispatch = useAppDispatch();

    const handleUsernameSubmit = () => {
        dispatch(updateUsername(username.current.value));
    }

    return (
        <div className="homepage">
            <div className='createRoomForm'>
                <span className='startInstructions'>{welcome}</span>
                <input type="text" id="username" className="userNameInput" name="username" ref={username} />
                <Button text='Confirm' buttonStyle={{ alignSelf: 'center' }} onClick={handleUsernameSubmit} routeAndClick={true} routesTo='room/create' />
            </div>
            {/* <div className='createRoomInstructions' style={{ whiteSpace: 'pre-wrap' }}>
                <hr />
                {instructions}
            </div> */}
        </div>
    )
}

export default Homepage
