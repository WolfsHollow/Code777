import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { selectPlayers, selectUsername, updatePlayers } from './gameStateSlice'

type props = {
    locationClass?: string,
    playerNumber: number,
}

const LobbyPlayerBox = ({ locationClass, playerNumber }: props) => {

    const dispatch = useAppDispatch();
    const username = useAppSelector(selectUsername);

    const handleClick = () => {
        dispatch(updatePlayers([username, playerNumber]))
    }

    return (
        <div className={`playerBoxContainer ${locationClass}`}>
            <div className='playerBox' onClick={handleClick}></div>
        </div>
    )
}

export default LobbyPlayerBox

