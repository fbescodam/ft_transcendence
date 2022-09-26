/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Navbar.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 12:10:49 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Navbar.css";
import React from "react";
import LogoGIF from "../../assets/Logo.gif"
import NavItem from "../../components/NavItem";

/*/////////////////////////////////////////////////////////////////////////////*/

const Navbar = () => {
	return (
		<div className="main-navbar">
			<div className="main-navbar-top-items">
				<div className="main-navbar-logo">
					<img width={72} height={72} src={LogoGIF} alt="Freek"/>
				</div>

				<NavItem href="/">
					<span className="material-symbols-rounded">Home</span>
					<p className="nav-item-text">Home</p>
				</NavItem>

				<NavItem href="/leaderboard">
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
				
				<NavItem href="/login">
					<span className="material-symbols-rounded">Logout</span>
					<p className="nav-item-text">Logout</p>
				</NavItem>
			</div>
		</div>
	);
};

export default Navbar;
