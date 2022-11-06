import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { selectUsername } from '../components/gameStateSlice'
import LobbyPlayerBox from '../components/LobbyPlayerBox'
import { WebSocketContext } from '../components/WebSocketComponent'
import { useAppDispatch, useAppSelector } from '../hooks/customHook'

const Lobby = () => {

    let ws = useContext(WebSocketContext);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const username = useAppSelector(selectUsername);

    const [players, setPlayers] = useState(['me', 'you', 'dupree']);
    const [chatMessages, setChatMessages] = useState([]);

    let playersList = players.map((user, index) => { return <div className='lobby-playerName' key={index} > {user}</div> })

    const handleMessage = (event) => {
        let value = ws.handleMessage(event);
        // setUserData({ ...userData, message: value })
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
                    <Button text='Start Game' routesTo='room/game' />
                </div>
            </div>
            <div className='rightContainer'>
                <div className='playerList'>{playersList}</div>
                <div className='chatBox'>
                    {/* {ws.publicChats.map((chat, index) => <div key={index}>{chat}</div>)} */}
                </div>
            </div>
        </div>
    )
}

export default Lobby
