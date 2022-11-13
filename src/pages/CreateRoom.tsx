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
        ws.connect()
    }

    const handleJoinClick = (event) => {
        setIsJoiningGame(true);
    }

    const handleJoinRoom = () => {
        ws.connect(roomID.current.value);
    }

    const handleBackButton = () => {
        setIsJoiningGame(false);
    }

    return (
        <div id="createRoomPage">
            <div className='createRoomForm' style={{ gap: '10px' }}>
                {isJoiningGame ?
                    <>
                        <div className="startInstructions" >Please enter a room ID</div>
                        <input type="text" id="roomID" className="roomInput" name="roomID" ref={roomID} />
                        <Button text='Join' buttonStyle={{ alignSelf: 'center' }} onClick={handleJoinRoom} routeAndClick={true} routesTo='room' />
                        <Button text='Back' buttonStyle={{ alignSelf: 'center' }} onClick={handleBackButton} />
                    </>
                    :
                    <>
                        <Button text='Create Room' buttonStyle={{ alignSelf: 'center' }} onClick={handleCreateRoom} routeAndClick={true} routesTo='room' />
                        <Button text='Join a Room' buttonStyle={{ alignSelf: 'center' }} onClick={handleJoinClick} />
                        <Button text='Back' buttonStyle={{ alignSelf: 'center' }} routesTo='homepage' />
                    </>
                }
            </div>
        </div>
    )
}

export default CreateRoom
