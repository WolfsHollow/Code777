import React, { useEffect, useState } from 'react'
import useUpdateEffect, { useAppSelector } from '../hooks/customHook'
import Card from './Card'
import { selectGuessNumbers, selectPlayerScores, selectPlayerTurn, selectUsername } from './gameStateSlice'

type props = {
    playerName: string,
    cards: Array<[string, number]>
    playerNumber: number,
}

const PlayerContainer = ({ playerName, cards, playerNumber }: props) => {
    const playerScores = useAppSelector(selectPlayerScores);
    const [color, setColor] = useState('white');
    const [borderStyle, setBorderStyle] = useState('1px solid black')

    const playerTurn = useAppSelector(selectPlayerTurn);

    useEffect(() => {
        if (playerTurn === playerNumber) {
            setColor('red');
            setBorderStyle('5px solid blue');
        }
        else if (playerTurn !== playerNumber && color === 'red') {
            setColor('white')
            setBorderStyle('1px solid black')
        }
    }, [playerTurn])

    return (
        <div className='playerContainer' style={{ backgroundColor: color, border: borderStyle }}>
            <div className='playerNameContainer' >
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
