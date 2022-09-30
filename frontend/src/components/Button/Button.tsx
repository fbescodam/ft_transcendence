/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Button.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 14:18:02 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Button.css"
import React from 'react';

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
	type?: 'submit' | 'reset' | 'button' | undefined;
    callback?: Function;
    children?: React.ReactNode;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A simple default styled button with no icon
 */
 const Button: React.FC<Properties> = ({ type, callback, children }) => {
    const handleClick = () => {
		if (callback != undefined)
			callback();
    };

    return (
        <button type={type} className="button-item" onClick={handleClick}>
            {children}
        </button>
    );
};

export default Button;