/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   NavItem.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/08 17:25:42 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./NavItem.css"
import React from 'react';
import { Navigate } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
    children: React.ReactNode;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const NavItem: React.FC<Properties> = ({ children }) => {

    return (
        <i className="nav-item">
            {children}
        </i>
    )
};

export default NavItem;