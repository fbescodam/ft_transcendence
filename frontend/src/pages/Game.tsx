
import GameCanvas from "../containers/GameCanvas/GameCanvas";
import Scoreboard from "../containers/Scoreboard/Scoreboard";
import "./Game.scss";

// Login page
const Game = () => {
	return (
		<div className="center-div canvas-body">
			<div>
				<Scoreboard />
				<GameCanvas />
			</div>
		</div>
	);
};

export default Game;
