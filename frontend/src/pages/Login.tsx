import "./Login.scss";
import React from "react";
import Logger from "../utils/Logger";
import logo42 from "../assets/42Logo.png";
import logoPong from "../assets/PongLogo.gif";
import Button from "../components/button/Button";

// Login page
const Login = () => {
	return (
		<header className="login-header">

			{/* Logo */}
			<img id="login-logo" src={logoPong} alt="logo" />

			{/* Welcome + Login */}
			<div className="login-body">
				
				<p>Welcome to BreadPong</p>

				{/* TODO: Connect to backend */}
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
