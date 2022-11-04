import React, { useState } from 'react'
import useUpdateEffect, { useAppSelector } from '../hooks/customHook'
import Card from './Card'
import { selectGuessNumbers, selectPlayerScores, selectUsername, selectUserPlayerNumber } from './gameStateSlice'

type props = {
    playerName: string
}


const UserPlayerContainer = ({ playerName }: props) => {

    const username = useAppSelector(selectUsername);
    const guessNumbers = useAppSelector(selectGuessNumbers);
    const playerScores = useAppSelector(selectPlayerScores);
    const userPlayerNumber = useAppSelector(selectUserPlayerNumber);

    const questionCards: Array<[string, any]> = [['?', '?'], ['?', '?'], ['?', '?']];
    const [cards, setCards] = useState(questionCards)

    useUpdateEffect(() => {
        setCards(guessNumbers);
    }, [guessNumbers])

    return (
        <div className='playerContainer'>
            <div className='playerNameContainer'>
                <div className='playerName'>{playerName}</div>
                <div className='score'>{playerScores[userPlayerNumber]}</div>
            </div>
            <Card value={cards[0]} />
            <Card value={cards[1]} />
            <Card value={cards[2]} />
        </div>
    )
}

export default UserPlayerContainer
