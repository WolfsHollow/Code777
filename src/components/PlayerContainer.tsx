import React from 'react'
import useUpdateEffect, { useAppSelector } from '../hooks/customHook'
import Card from './Card'
import { selectGuessNumbers, selectPlayerScores, selectUsername } from './gameStateSlice'

type props = {
    playerName: string,
    cards: Array<[string, number]>
    playerNumber: number,
}



const PlayerContainer = ({ playerName, cards, playerNumber }: props) => {
    // [['gre', 1],['gre', 1],['gre', 1]]

    const playerScores = useAppSelector(selectPlayerScores);

    return (
        <div className='playerContainer'>
            <div className='playerNameContainer'>
                <div className='playerName'>{playerName}</div>
                <div className='score'>{playerScores[playerNumber]}</div>
            </div>
            <Card value={cards[0]} />
            <Card value={cards[1]} />
            <Card value={cards[2]} />
        </div>
    )
}

export default PlayerContainer
