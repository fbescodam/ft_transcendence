import React from "react";
import logo from "../assets/PongLogo.gif";
import logo42 from "../assets/42-logo.svg";
import Button from "../components/button/Button";
import Logger from "../utils/Logger";
import "./Login.scss";

// Login page
const Login = () => {
	return (
		<div className="Login">
			<header className="Login-header">
				<img src={logo} className="Login-logo" alt="logo" />
				<p>Welcome to BreadPong</p>
				<Button callback={() => { Logger.info("Hello World!"); }}>
					<p>LOGIN</p>
				</Button>
			</header>
		</div>
	);
};

export default Login;
