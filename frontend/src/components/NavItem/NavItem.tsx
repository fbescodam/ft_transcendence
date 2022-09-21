/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   NavItem.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 11:52:00 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./NavItem.css";
import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
    href: string;
	children: React.ReactNode;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
const NavItem: React.FC<Properties> = ({ href, children }) => {
	return (
		<Link className="nav-item" to={href}>
            {children}
		</Link>
	);
};

export default NavItem;
