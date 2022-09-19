/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 14:45:30 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React from 'react';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const ChatPage = () => {
    return (
		<Layout>
			<Container>
				<h1>Chat Page</h1>
			</Container>
		</Layout>
    );
};

export default ChatPage;