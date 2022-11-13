import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { selectPlayers, selectUsername } from '../components/gameStateSlice'
import LobbyPlayerBox from '../components/LobbyPlayerBox'
import { WebSocketContext } from '../components/WebSocketComponent'
import { TYPE } from '../data/constants'
import useUpdateEffect, { useAppDispatch, useAppSelector } from '../hooks/customHook'

const Lobby = () => {

    let ws = useContext(WebSocketContext);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const username = useAppSelector(selectUsername);
    const players = useAppSelector(selectPlayers);

    // console.log('lobby - players in room ', ws.playersInRoom)
    let playerList = Object.keys(ws.playersInRoom);

    let playerDivs: Array<React.ReactNode> = useMemo(() => {
        let divs = playerList.map((user, index) => {
            return <div className='lobby-playerName' key={user}>{user}</div>
        })
        return divs;
    }, [playerList])

    const handleMessage = (event) => {
        let value = ws.handleMessage(event);
    }

    const handleStartGame = () => {
        if (ws.host.current === username) {
            ws.sendMessage(username, TYPE.INITIALIZE_GAME, 'START GAME')
        }
        else console.error('ONLY THE HOST CAN START THE GAME')
    }

    return (
        <div className='lobby'>
            <div className='leftContainer'>
                <div className='playerSelectorContainer'>
                    <LobbyPlayerBox locationClass={'evenPlayer'} playerNumber={1} />
                    <LobbyPlayerBox locationClass={'evenPlayer'} playerNumber={3} />
                    <LobbyPlayerBox locationClass={''} playerNumber={0} />
                    <LobbyPlayerBox locationClass={''} playerNumber={2} />
                </div>
                <div className='startGameContainer'>
                    <div style={{ backgroundColor: "lightblue", fontSize: '2rem', height: '100px', width: "350px" }}>{ws.roomJoined}</div>
                    <Button text='Start Game' onClick={handleStartGame} />
                </div>
            </div>
            <div className='rightContainer'>
                <div className='playerList'>{playerDivs}</div>
                <div className='chatBox'>1
                </div>
            </div>
        </div>
    )
}

export default Lobby
