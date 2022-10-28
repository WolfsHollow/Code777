import React from 'react'
import Card from './Card'

const PlayerContainer = ({ playerName, cards }) => {

    console.log(cards[0], cards[1], cards[2])
    return (
        <div className='playerContainer'>
            <div className='playerNameContainer'>
                <div className='playerName'>{playerName}</div>
            </div>
            {/* <div className='cardTrayContainer'> */}
            {/* </div> */}
            <div className='cardContainer'>
                <div className='cardTray'></div>
                <Card value={cards[0]} />
                <Card value={cards[1]} />
                <Card value={cards[2]} />
            </div>
        </div>
    )
}

export default PlayerContainer
