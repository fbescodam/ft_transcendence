/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Navbar.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 14:48:00 by lde-la-h      ########   odam.nl         */
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
					<p className="nav-item-text">Home</p>
				</NavItem>
				<NavItem href="/404">
					<span className="material-symbols-rounded">Leaderboard</span>
					<p className="nav-item-text">Friends</p>
				</NavItem>
				<NavItem href="/game">
					<span className="material-symbols-rounded">Stadia_controller</span>
					<p className="nav-item-text">Games</p>
				</NavItem>
				<NavItem href="/chat">
					<span className="material-symbols-rounded">Chat</span>
					<p className="nav-item-text">Chat</p>
				</NavItem>
			</div>

			<div>
				<NavItem href="/settings">
					<span className="material-symbols-rounded">Settings</span>
					<p className="nav-item-text">Settings</p>
				</NavItem>
			</div>
		</div>
	);
};

export default Navbar;
