/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Navbar.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/08 17:26:12 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Navbar.css";
import React from "react";
import NavItem from "../../components/NavItem";
import { Navigate } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////

const Navbar = () => {
	return (
		<div className="main-navbar">
			<NavItem>
				Hey!
			</NavItem>
			<NavItem>
				Hey!
			</NavItem>
			<NavItem>
				Hey!
			</NavItem>
			<NavItem>
				Hey!
			</NavItem>
			<NavItem>
				Hey!
			</NavItem>
			<NavItem>
				Hey!
			</NavItem>
		</div>
	)
};

export default Navbar;
