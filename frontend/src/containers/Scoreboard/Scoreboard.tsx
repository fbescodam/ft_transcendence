import "./Scoreboard.scss";

const Scoreboard = () => {

	return (
		<div className="score-board">
			<div className="score-display">
				<img className="profile-pic" width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512"/>
				<div className="score">
					<span id="p1-score">1</span>
					<span>:</span>
					<span id="p2-score">1</span>
				</div>
				<img className="profile-pic" width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03VCRL8328-f8fc04f7f629-512"/>
			</div>
		</div>
	);
};

export default Scoreboard;