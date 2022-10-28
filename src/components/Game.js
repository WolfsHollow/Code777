import React from 'react'
import PlayerContainer from './PlayerContainer'
import Question from './Question'

const Game = () => {

    const players = {
        PLAYER_ONE: ['Player One', ['G1', 'G2', 'G3']],
        PLAYER_TWO: ['Player Two', ['B1', 'B2', 'B3']],
        PLAYER_THREE: ['Player Three', ['P1', 'P2', 'P3']],
        PLAYER_FOUR: ['Player Four', ['Y1', 'Y2', 'Y3']],
    }

    return (
        <>
            <Question />
            <div className='playerBoardContainer'>
                <PlayerContainer playerName={players.PLAYER_ONE[0]} cards={players.PLAYER_ONE[1]} />
                <PlayerContainer playerName={players.PLAYER_TWO[0]} cards={players.PLAYER_TWO[1]} />
                <PlayerContainer playerName={players.PLAYER_THREE[0]} cards={players.PLAYER_THREE[1]} />
                {/* <PlayerContainer playerName={players.PLAYER_FOUR[0]} cards={players.PLAYER_FOUR[1]} /> */}
            </div>
        </>
    )
}

export default Game
