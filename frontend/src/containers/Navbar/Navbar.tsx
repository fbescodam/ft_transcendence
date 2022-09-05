import "./Navbar.scss";
import React from "react";
import Button from "../../components/button/Button";


////////////////////////////////////////////////////////////////////////////////

/**
 * Routing navigation bar
 */
const Navbar = () => {

    return (
		<div className="navbar">
			<div className="navigation-content">
				<Button callback={() => {}}>Home</Button>
				<Button callback={() => {}}>Leaderboard</Button>
				<Button callback={() => {}}>Chat</Button>
			</div>
			<div className="login-content">
				<img className="profile-pic" width={32} height={32} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512"/>
				<Button callback={() => {}}>Logout</Button>
			</div>
		</div>
    );
};

export default Navbar;