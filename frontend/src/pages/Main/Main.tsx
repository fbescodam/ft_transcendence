import "./Main.scss";
import React from "react";
import logo42 from "../assets/42Logo.png";
import Logger from "../../utils/Logger";
import Navbar from "../../containers/Navbar";

// Login page
const Main = () => {
	return (
		<div className="main-div">
			<header className="main-header">
				<Navbar />
			</header>
			<main className="main-body">
					<img src="https://thumbs.gfycat.com/DazzlingMajesticChihuahua-size_restricted.gif" />
			</main>
		</div>
	);
};

export default Main;
