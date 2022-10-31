import React from 'react'

interface props {
    value: [string, number]
}

const Card = ({ value }: props) => {
    return (
        <div className={`card ${value[0]}`}>
            {value[1]}
        </div>
    )
}

export default Card
