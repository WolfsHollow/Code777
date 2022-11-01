import React, { useRef } from 'react'
import Button from '../components/Button'
import { updateUsername } from '../components/gameStateSlice';
import { useAppDispatch } from '../hooks/customHook'

const CreateRoom = () => {

    const username = useRef(null);

    const dispatch = useAppDispatch();

    const handleUsernameSubmit = () => {
        dispatch(updateUsername(username.current.value));
    }

    return (
        <div>
            <div className='Login Form'>
                <form className='loginForm'>
                    <label htmlFor="username">
                        <span>User Name</span>
                        <input type="text" id="username" name="username" ref={username} />
                    </label>
                </form>
            </div>
            <Button className='confirmButton' text='Create Room' onClick={handleUsernameSubmit} routeAndClick={true} routesTo='room' />
        </div>
    )
}

export default CreateRoom
