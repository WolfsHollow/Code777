import React, { MouseEvent, MouseEventHandler, useContext, useRef, useState } from 'react'
import Button from '../components/Button'
import { updateUsername } from '../components/gameStateSlice';
import { WebSocketContext } from '../components/WebSocketComponent';
import { useAppDispatch } from '../hooks/customHook'

interface Iclick {
    handleClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const CreateRoom = () => {

    const ws = useContext(WebSocketContext);

    const roomID = useRef(null);


    const [isJoiningGame, setIsJoiningGame] = useState(false);

    const dispatch = useAppDispatch();

    const handleCreateRoom = () => {

    }

    const handleJoinClick = (event) => {
        setIsJoiningGame(true);
    }

    const handleJoinRoom = () => {
        ws.subscribe(roomID.current.value)
    }

    return (
        <div id="createRoomPage">
            <div className='createRoomForm'>
                {isJoiningGame ?
                    <>
                        <div className="createRoomInstructions">Please enter a room name</div>
                        <input type="text" id="roomID" className="roomInput" name="roomID" ref={roomID} />
                        <Button text='Join' buttonStyle={{ alignSelf: 'center' }} onClick={handleJoinRoom} routeAndClick={true} routesTo='room' />
                    </>
                    :
                    <>
                        <Button text='Create Room' buttonStyle={{ alignSelf: 'center' }} onClick={handleCreateRoom} routeAndClick={true} routesTo='room' />
                        <Button text='Join a Room' buttonStyle={{ alignSelf: 'center' }} onClick={handleJoinClick} />
                    </>
                }
            </div>
        </div>
    )
}

export default CreateRoom
