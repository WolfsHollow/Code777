import React from 'react'

const Card = ({ value }) => {
    return (
        <div className={`card ${value[0]}`}>
            {value[1]}
        </div>
    )
}

export default Card
