import React, { useRef, useState } from 'react'
import useUpdateEffect, { useAppDispatch, useAppSelector } from '../hooks/customHook'
import { addGuessNumber, removeGuessNumber, resetNumberCard, selectGuessNumbers } from './gameStateSlice'

type props = {
    color: string,
    value: number,
    grid: string,
    reset: boolean,
}

const CLICK_COLORS = {
    DEFAULT: 'white',
    WRONG: 'dimgrey',
    MAYBE: 'gold',
    GUESS: 'forestgreen',
}

const Number = ({ color, value, grid, reset }: props) => {

    const [backgroundColor, setBackgroundColor] = useState('white')

    const greenIndex = useRef<number>();

    const dispatch = useAppDispatch();

    const guessNumbers = useAppSelector(selectGuessNumbers);

    const resetColor = () => {
        dispatch(resetNumberCard())
        greenIndex.current = null;
        setBackgroundColor(CLICK_COLORS.DEFAULT);
    }

    const cycleColor = () => {
        let cardColor = backgroundColor;
        switch (cardColor) {
            case CLICK_COLORS.DEFAULT:
                cardColor = CLICK_COLORS.WRONG;
                break;
            case CLICK_COLORS.WRONG:
                cardColor = CLICK_COLORS.MAYBE;
                break;
            case CLICK_COLORS.MAYBE:
                if (guessNumbers.length >= 3) {
                    cardColor = CLICK_COLORS.DEFAULT
                    break;
                }
                cardColor = CLICK_COLORS.GUESS;
                let payload: [string, number] = [color, value];
                greenIndex.current = guessNumbers.length;
                dispatch(addGuessNumber(payload))
                break;
            case CLICK_COLORS.GUESS:
                dispatch(removeGuessNumber(greenIndex.current))
                greenIndex.current = null;
                cardColor = CLICK_COLORS.DEFAULT;
                break;
            default:
                cardColor = CLICK_COLORS.DEFAULT;
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

    useUpdateEffect(() => {
        if (reset) resetColor()
    }, [reset])

    return (
        <div onClick={onClick} style={{ gridArea: grid, backgroundColor: backgroundColor }} className={`number ${color}`}>
            {/* <div onClick={onClick} style={{ gridArea: grid, backgroundColor: backgroundColor }} className={`b-game-card`}> */}

            {value}
        </div >
    )
}

export default Number
