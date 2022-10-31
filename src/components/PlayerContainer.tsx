import React from 'react'
import Card from './Card'

const PlayerContainer = ({ playerName, cards }) => {

    return (
        <div className='playerContainer'>
            <div className='playerNameContainer'>
                <div className='playerName'>{playerName}</div>
                <div className='score'>3</div>
            </div>
            <Card value={cards[0]} />
            <Card value={cards[1]} />
            <Card value={cards[2]} />
        </div>
    )
}

export default PlayerContainer
