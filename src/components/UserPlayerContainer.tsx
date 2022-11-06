import React, { useEffect, useState } from 'react'
import useUpdateEffect, { useAppSelector } from '../hooks/customHook'
import Card from './Card'
import { selectGuessNumbers, selectPlayerScores, selectPlayerTurn, selectUsername, selectUserPlayerNumber } from './gameStateSlice'

const UserPlayerContainer = () => {

    const username = useAppSelector(selectUsername);
    const guessNumbers = useAppSelector(selectGuessNumbers);
    const playerScores = useAppSelector(selectPlayerScores);
    const userPlayerNumber = useAppSelector(selectUserPlayerNumber);
    const playerTurn = useAppSelector(selectPlayerTurn);

    const questionCards: Array<[string, any]> = [['?', '?'], ['?', '?'], ['?', '?']];
    const [cards, setCards] = useState(questionCards)

    const [color, setColor] = useState('white');

    useEffect(() => {
        if (playerTurn === userPlayerNumber) {
            setColor('red')
        }
        else if (playerTurn !== userPlayerNumber && color === 'red') {
            setColor('white')
        }
    }, [playerTurn])

    useUpdateEffect(() => {
        setCards(guessNumbers);
    }, [guessNumbers])

    return (
        <div className='playerContainer' style={{ backgroundColor: color }}>
            <div className='playerNameContainer'>
                <div className='playerName'>{username}</div>
                <div className='score'>{playerScores[userPlayerNumber]}</div>
            </div>
            <Card value={cards[0]} />
            <Card value={cards[1]} />
            <Card value={cards[2]} />
        </div>
    )
}

export default UserPlayerContainer
