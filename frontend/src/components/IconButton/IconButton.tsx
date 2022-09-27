/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   IconButton.tsx                                       :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 14:03:50 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./IconButton.css";
import React from "react";

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
	type?: 'submit' | 'reset' | 'button' | undefined;
	icon: string;
    name: string;
    callback: VoidFunction;
    children?: React.ReactNode;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
const IconButton: React.FC<Properties> = ({ type, icon, name, callback, children }) => {

	const handle = () => {
		callback();
	}

	return (
		<button type={type} className="icon-button" onClick={() => { handle() }}>
			<span className="material-symbols-rounded">{icon}</span>
			<p className="icon-button-text">{name}</p>
			{children}
		</button>
	);
};

export default IconButton;
