import React from 'react'
import { Route, useNavigate } from 'react-router-dom'

const Button = ({ text, routesTo, onClick, routeAndClick, className, buttonStyle, type }) => {

    const navigate = useNavigate();

    const handleClick = () => {

        if (routesTo === 'homepage') { // need to change url to '/'
            routesTo = '';
        }


        if (routeAndClick) {
            onClick();
            navigate(`/${routesTo}`);
        }
        else {
            if (routesTo) {
                navigate(`/${routesTo}`);
            }
            else {
                onClick()
            }
        }
    }

    return (
        <button type={type} style={buttonStyle} className={className ? className : 'button button-glow'} onClick={handleClick}>
            {text}
        </button>
    )
}

export default Button
