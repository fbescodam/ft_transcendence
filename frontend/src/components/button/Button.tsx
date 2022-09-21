/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Button.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 19:01:08 by lde-la-h      ########   odam.nl         */
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
 * A button with a text value, a callback and possibly an icon.
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