/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Login.tsx                                          :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 15:54:17 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Login.css"
import React, { useEffect } from 'react';
import Button from "../../components/Button";
import Logger from "../../utils/Logger";
import LogoGIF from "../../assets/Logo.gif"
import Logo42 from "../../assets/42Logo.png"
import Navbar from "../../containers/Navbar";
import { Navigate, useNavigate } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const LoginPage = () => {

	const navigate = useNavigate();

	return (
		<>
			<div id="login">

				{/* Logo */}
				<img id="login-logo" src={LogoGIF} alt="Freek" />

				{/* Welcome + Login */}
				<div className="login-body">
					
					<p>Welcome to BreadPong</p>

					{/* TODO: Connect to backend */}
					<Button callback={() => { navigate("/home") }}>
						<div className="login-button-content">
							<img src={Logo42} width={28} height={28} alt="42" />
							<p>LOGIN</p>
						</div>
					</Button>
				</div>
			</div>
		</>
	);
};

export default LoginPage;