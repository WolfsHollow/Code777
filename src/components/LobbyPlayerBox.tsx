import React, { useContext, useEffect, useRef, useState } from 'react'
import { TYPE } from '../data/constants'
import useUpdateEffect, { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { selectPlayers, selectUsername, updatePlayers, updateUserPlayerNumber, } from './gameStateSlice'
import { WebSocketContext } from './WebSocketComponent'
import redLock from '../assets/images/redLockIcon.png'
import greenLock from '../assets/images/greenLockIconUnlock.png'

type props = {
    locationClass?: string,
    playerNumber: number,
}

const LobbyPlayerBox = ({ locationClass, playerNumber }: props) => {

    const ws = useContext(WebSocketContext);

    const dispatch = useAppDispatch();
    const username = useAppSelector(selectUsername);
    const players = useAppSelector(selectPlayers);
    const lockIcon = useRef(redLock);

    const [text, setText] = useState('UNLOCK');

    const handleClick = () => {
        if (text === 'UNLOCK') {
            let newPlayersInRoom = { ...ws.playersInRoom };
            let newPlayers = [...players];
            let index = newPlayersInRoom[username];
            if (index !== -1) {
                delete newPlayersInRoom[username];
                newPlayers[index] = '';
            }
            newPlayersInRoom[username] = playerNumber;
            newPlayers[playerNumber] = username;
            setText(username);
            lockIcon.current = greenLock;
            dispatch(updateUserPlayerNumber(playerNumber));
            dispatch(updatePlayers(newPlayers))
            ws.setPlayersInRoom(newPlayersInRoom);
            ws.sendMessage(username, TYPE.LOBBY_INFO, newPlayersInRoom);
        }
        else console.log('SPOT ALREADY TAKEN!')
    }

    useUpdateEffect(() => {
        if (players[playerNumber] === '') {
            setText('UNLOCK');
            lockIcon.current = redLock;
        }
        else {
            setText(players[playerNumber]);
            lockIcon.current = greenLock;
        }
    }, [players[playerNumber]])

    return (
        <div className={`playerBoxContainer ${locationClass}`}>
            <button className='playerBox'
                style={{ backgroundImage: `url(${lockIcon.current})` }}
                onClick={handleClick} >
                {text}
            </button>
        </div >
    )
}

export default LobbyPlayerBox

