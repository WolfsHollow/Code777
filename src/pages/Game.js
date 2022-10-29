import React, { useRef, useState } from 'react'
import PlayerContainer from '../components/PlayerContainer'
import Question from '../components/Question'
import Number from '../components/Number'
import { NUMBERS } from '../data/constants'
import { shuffle } from '../utilities/helpers'

const Game = () => {

    const deck = useRef(shuffle());

    const players = {
        PLAYER_ONE: ['Player One', ['G1', 'G2', 'G3"']],
        PLAYER_TWO: ['Player Two', ['B1', 'B2', 'B3']],
        PLAYER_THREE: ['Player Three', ['P1', 'P2', 'P3']],
        PLAYER_FOUR: ['Pla YOU', ['??', '??', '??']],
    }

    const numberDivs = NUMBERS.map((entry) =>
        <Number color={entry[0]} value={entry[1]} grid={entry[2]} />)


    const dealCards = () => {

    }

    console.log(deck);

    return (
        <div className='gameplay'>
            <Question />
            <div className='playerBoardContainer'>
                <PlayerContainer playerName={players.PLAYER_ONE[0]} cards={players.PLAYER_ONE[1]} />
                <PlayerContainer playerName={players.PLAYER_TWO[0]} cards={players.PLAYER_TWO[1]} />
                <PlayerContainer playerName={players.PLAYER_THREE[0]} cards={players.PLAYER_THREE[1]} />
                {/* <PlayerContainer playerName={players.PLAYER_FOUR[0]} cards={players.PLAYER_FOUR[1]} /> */}
            </div>
            <div className='chat'></div>
            <div className='numberNoteCardContainer'>
                <div className='editButtons'>
                    <PlayerContainer playerName={players.PLAYER_FOUR[0]} cards={players.PLAYER_FOUR[1]} />
                </div>
                <div className='numberNoteCard'>
                    {numberDivs}
                </div>
            </div>
        </div >
    )
}

export default Game
