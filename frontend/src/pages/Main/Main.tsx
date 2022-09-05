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
				<div id="main-container" className="background-default">
					{/* Match selection */}
					<div className="matchmaking">
						MatchMaking
					</div>

					{/* Events / global chat */}
					<div className="global-chat">
						Chat
					</div>
				</div>
			</main>
		</div>
	);
};

export default Main;
