/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   ScoreDisplay.tsx                                   :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/19 19:50:46 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 19:55:46 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import Container from "../Container";
import "./ScoreDisplay.css";

////////////////////////////////////////////////////////////////////////////////

const ScoreDisplay = () => {
	return (
		<Container>
			<div className="score-panel">
				<img className="profile-pic" width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512"/>
				<div className="score-display">
					<span id="p1-score">1</span>
					<span>:</span>
					<span id="p2-score">1</span>
				</div>
				<img className="profile-pic" width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03VCRL8328-f8fc04f7f629-512"/>
			</div>
		</Container>
	)
};

export default ScoreDisplay;