import Scoretracker from "../../components/scoretracker/ScoreTracker";
import "./Scoreboard.scss";

/**
 * Displays two user profiles with a score tracker in between
 */
const Scoreboard = () => {

	return (
		<div className="score-board">
			<div className="score-display">
				<img className="profile-pic" width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512"/>
				<Scoretracker />
				<img className="profile-pic" width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03VCRL8328-f8fc04f7f629-512"/>
			</div>
		</div>
	);
};

export default Scoreboard;