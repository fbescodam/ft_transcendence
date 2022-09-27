/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   NavItem.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 13:56:10 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./NavItem.css";
import React from "react";
import { Link } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
    href: string;
    icon: string;
    name: string;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
const NavItem: React.FC<Properties> = ({ href, icon, name }) => {
	return (
		<Link className="nav-item" to={href}>
			<span className="material-symbols-rounded">{icon}</span>
			<p className="nav-item-text">{name}</p>
		</Link>
	);
};

export default NavItem;
