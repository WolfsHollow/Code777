import React from 'react'
import Button from '../components/Button'
import { selectUsername } from '../components/gameStateSlice'
import LobbyPlayerBox from '../components/LobbyPlayerBox'
import { useAppSelector } from '../hooks/customHook'

const Lobby = () => {

    const username = useAppSelector(selectUsername);
    console.log(username);

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
                <div className='playerList'></div>
                <div className='chatBox'></div>
            </div>
        </div>
    )
}

export default Lobby
