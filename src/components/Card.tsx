import React from 'react'

interface props {
    value: [string, any]
}

const Card = ({ value }: props) => {

    if (!value) {
        value = ['?', '?']
    }

    return (
        <div className={`card ${value[0]}`}>
            {value[1]}
        </div>
    )
}

export default Card
