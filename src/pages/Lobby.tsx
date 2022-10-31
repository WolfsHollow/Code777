import React from 'react'
import Button from '../components/Button'

const Lobby = () => {
    return (
        <div>
            <Button text='Start Game' routesTo='room/game' />
        </div>
    )
}

export default Lobby
