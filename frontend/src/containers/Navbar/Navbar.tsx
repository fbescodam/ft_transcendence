/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Navbar.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 14:10:41 by lde-la-h      ########   odam.nl         */
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

				<NavItem href="/" name="Home" icon="Home" />
				<NavItem href="/leaderboard" name="Friends" icon="Leaderboard" />
				<NavItem href="/game" name="Games" icon="Stadia_controller" />
				<NavItem href="/chat" name="Chat" icon="Chat" />
			</div>

			<div  className="main-navbar-bot-items">
				<NavItem href="/settings" name="Settingst" icon="Settings" />
				<NavItem href="/login" name="Logout" icon="Logout" />
			</div>
		</div>
	);
};

export default Navbar;
