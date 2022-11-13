import React, { useContext, useEffect } from 'react'
import { TYPE } from '../data/constants'
import useUpdateEffect, { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { selectPlayers, selectUsername, updatePlayers, updateUserPlayerNumber, } from './gameStateSlice'
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
        if (players[playerNumber] === '') {
            let newPlayersInRoom = { ...ws.playersInRoom };
            let newPlayers = [...players];
            let index = newPlayersInRoom[username];
            if (index !== -1) {
                delete newPlayersInRoom[username];
                newPlayers[index] = '';
            }
            newPlayersInRoom[username] = playerNumber;
            newPlayers[playerNumber] = username;
            dispatch(updateUserPlayerNumber(playerNumber));
            dispatch(updatePlayers(newPlayers))
            ws.setPlayersInRoom(newPlayersInRoom);
            ws.sendMessage(username, TYPE.LOBBY_INFO, newPlayersInRoom);
        }
        else console.log('SPOT ALREADY TAKEN!')
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

