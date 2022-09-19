/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Navbar.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 13:55:52 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Navbar.css";
import React from "react";
import LogoGIF from "../../assets/Logo.gif"
import NavItem from "../../components/NavItem";
import { Navigate } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////

const Navbar = () => {
	return (
		<div className="main-navbar">
			<div>
				<img width={64} height={64} src={LogoGIF} alt="Freek" />

				<NavItem href="/">
					<span className="material-symbols-rounded">Home</span>
				</NavItem>
				<NavItem href="/">
					<span className="material-symbols-rounded">Search</span>
				</NavItem>
				<NavItem href="/">
					<span className="material-symbols-rounded">Stadia_controller</span>
				</NavItem>
				<NavItem href="/">
					<span className="material-symbols-rounded">Chat</span>
				</NavItem>
			</div>

			<div>
				<NavItem href="/">
					<span className="material-symbols-rounded">Settings</span>
				</NavItem>
			</div>
		</div>
	);
};

export default Navbar;
