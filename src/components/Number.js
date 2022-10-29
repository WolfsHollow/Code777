import React, { useState } from 'react'

const Number = ({ color, value, grid }) => {

    const [backgroundColor, setBackgroundColor] = useState('white')

    const cycleColor = () => {
        let color = backgroundColor;
        switch (color) {
            case "white":
                color = 'yellow';
                break;
            case "yellow":
                color = 'green';
                break;
            case "green":
                color = 'white';
                break;
            case "grey":
                color = 'white';
                break;
            default:
                color = "white"
                break;
        }
        return color;
    }

    const onClick = (e) => {
        setBackgroundColor(cycleColor());
    }

    return (
        <div onClick={onClick} style={{ gridArea: grid, backgroundColor: backgroundColor }} className={`number ${color}`}>
            {value}
        </div >
    )
}

export default Number
