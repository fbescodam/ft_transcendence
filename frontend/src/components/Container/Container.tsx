/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Container.tsx                                      :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/08 13:40:32 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Container.css"
import React from 'react';

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
	children?: React.ReactNode;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A standardized styled div.
 */
const Container: React.FC<Properties> = ({ children }) => {

	return (
		<div className="container">
			{children}
		</div>
	);
};

export default Container;