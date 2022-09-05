/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Login.tsx                                          :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/05 21:16:47 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Login.css"
import React from 'react';
import Button from "../../components/Button";
import Logger from "../../utils/Logger";


////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const LoginPage = () => {
	return (
		<header className="login-header">

			{/* Logo */}
			<img id="login-logo" alt="FFreek" />

			{/* Welcome + Login */}
			<div className="login-body">
				
				<p>Welcome to BreadPong</p>

				{/* TODO: Connect to backend */}
				<Button callback={() => { Logger.info("Hello World!"); }}>
					<div className="login-button-content">
						<img  width={32} height={32} alt="42" />
						<p>LOGIN</p>
					</div>
				</Button>
			</div>
		</header>
	);
};

export default LoginPage;