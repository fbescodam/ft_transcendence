import "./Button.scss"
import React from 'react';

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
    callback: Function;
    children?: React.ReactNode;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const Button: React.FC<Properties> = ({ callback, children }) => {
    const handleClick = () => {
        callback();
    };

    return (
        <button className="btn" onClick={handleClick}>
            {children}
        </button>
    );
};

export default Button;