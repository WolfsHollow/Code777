import React, { useRef, useState } from 'react'
import useUpdateEffect, { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { addGuessNumber, removeGuessNumber, selectGuessNumbers } from './gameStateSlice'

type props = {
    color: string,
    value: number,
    grid: string,
}

const Number = ({ color, value, grid }: props) => {

    const [backgroundColor, setBackgroundColor] = useState('white')

    const greenIndex = useRef<number>();

    const dispatch = useAppDispatch();

    const guessNumbers = useAppSelector(selectGuessNumbers);

    const cycleColor = () => {
        let cardColor = backgroundColor;
        switch (cardColor) {
            case "white":
                cardColor = 'red';
                break;
            case "red":
                cardColor = 'yellow';
                break;
            case "yellow":
                if (guessNumbers.length >= 3) {
                    cardColor = 'white'
                    break;
                }
                cardColor = 'green';
                let payload: [string, number] = [color, value];
                greenIndex.current = guessNumbers.length;
                dispatch(addGuessNumber(payload))
                break;
            case "green":
                dispatch(removeGuessNumber(greenIndex.current))
                greenIndex.current = null;
                cardColor = 'white';
                break;
            case "grey":
                cardColor = 'white';
                break;
            default:
                cardColor = "white"
                break;
        }
        return cardColor;
    }

    const onClick = (e) => {
        setBackgroundColor(cycleColor());
    }

    useUpdateEffect(() => {
        if (greenIndex.current) {
            if (greenIndex.current >= guessNumbers.length) {
                greenIndex.current -= 1;
            }
        }
    }, [guessNumbers])

    return (
        <div onClick={onClick} style={{ gridArea: grid, backgroundColor: backgroundColor }} className={`number ${color}`}>
            {value}
        </div >
    )
}

export default Number
