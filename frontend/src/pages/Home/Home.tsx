/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Home.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 14:25:56 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Home.css";
import React from "react";
import Container from "../../components/Container";
import Navbar from "../../containers/Navbar";
import Layout from "../../containers/Layout";

////////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
const HomePage = () => {
	return (
		<Layout>
			<Container>
				<h1>Home Page</h1>
			</Container>
		</Layout>
		// <div className="home">
		// 	<Navbar />
		// 	<Container>
		// 		<h1>Home Page</h1>
		// 	</Container>
		// </div>
	);
};

export default HomePage;
