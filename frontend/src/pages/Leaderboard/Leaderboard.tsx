/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Leaderboard.tsx                                    :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 12:53:24 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Leaderboard.css"
import React from 'react';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import ScoreDisplay from "../../components/ScoreDisplay";

////////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
 const LeaderboardPage = () => {
    return (
		<Layout>
			<Container>
				<h1>Leaderbord</h1>
			</Container>

			<Container>
				<div className="leaderboard-content">
					<ScoreDisplay />
					<ScoreDisplay />
					<ScoreDisplay />
					<ScoreDisplay />
					<ScoreDisplay />
					<ScoreDisplay />
					<ScoreDisplay />
				</div>
			</Container>
		</Layout>
    );
};

export default LeaderboardPage;