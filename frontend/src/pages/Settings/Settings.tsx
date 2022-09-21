/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Settings.tsx                                       :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 17:32:03 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Settings.css"
import React from 'react';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";

////////////////////////////////////////////////////////////////////////////////

/**
 * 
 */
 const SettingsPage = () => {
    return (
		<Layout>
			<Container>
				<h1>Settings Page</h1>
			</Container>
		</Layout>
    );
};

export default SettingsPage;