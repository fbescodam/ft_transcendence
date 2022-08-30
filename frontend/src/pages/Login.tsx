import "./Login.scss";
import React from "react";
import logo from "../assets/PongLogo.gif";
import logo42 from "../assets/42Logo.png";
import Button from "../components/button/Button";
import Logger from "../utils/Logger";

// Login page
const Login = () => {
	return (
		<header className="login-header">

			{/* Logo */}
			<img src={logo} className="login-logo" alt="logo" />

			{/* Welcome + Login */}
			<div className="login-body">
				
				<p>Welcome to BreadPong</p>

				<Button callback={() => { Logger.info("Hello World!"); }}>
					<div className="login-button-content">
						<img src={logo42} width={32} height={32} alt="logo" />
						<p>LOGIN</p>
					</div>
				</Button>
			</div>

		</header>
	);
};

export default Login;
