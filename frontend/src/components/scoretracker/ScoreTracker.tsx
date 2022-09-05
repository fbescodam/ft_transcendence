/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   ScoreTracker.tsx                                   :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/07/25 11:38:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/05 11:49:26 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./ScoreTracker.scss";

////////////////////////////////////////////////////////////////////////////////

const Scoretracker = () => {
	return (
		<div className="score">
			<span id="p1-score">1</span>
			<span>:</span>
			<span id="p2-score">1</span>
		</div>
	)
};

export default Scoretracker;
