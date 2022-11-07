import React, { useContext, useEffect } from 'react'
import { TYPE } from '../data/constants'
import { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { selectPlayers, selectUsername, updatePlayers } from './gameStateSlice'
import { WebSocketContext } from './WebSocketComponent'


type props = {
    locationClass?: string,
    playerNumber: number,
}

const LobbyPlayerBox = ({ locationClass, playerNumber }: props) => {

    const ws = useContext(WebSocketContext);

    const dispatch = useAppDispatch();
    const username = useAppSelector(selectUsername);
    const players = useAppSelector(selectPlayers);

    const handleClick = () => {
        dispatch(updatePlayers([username, playerNumber]))
    }

    return (
        <div className={`playerBoxContainer ${locationClass}`}>
            <div className='playerBox' onClick={handleClick}>
                {players[playerNumber]}
            </div>
        </div>
    )
}

export default LobbyPlayerBox

