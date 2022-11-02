import React, { useState } from 'react'
import useUpdateEffect, { useAppSelector } from '../hooks/customHook'
import Card from './Card'
import { selectGuessNumbers, selectUsername } from './gameStateSlice'

type props = {
    playerName: string
}


const UserPlayerContainer = ({ playerName }: props) => {

    const username = useAppSelector(selectUsername);
    const guessNumbers = useAppSelector(selectGuessNumbers);

    const questionCards: Array<[string, any]> = [['?', '?'], ['?', '?'], ['?', '?']];
    const [cards, setCards] = useState(questionCards)

    useUpdateEffect(() => {
        setCards(guessNumbers);
    }, [guessNumbers])

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

export default UserPlayerContainer
