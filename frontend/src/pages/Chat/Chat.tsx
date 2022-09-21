/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/21 20:28:59 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React from 'react';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import ChatBox from "../../containers/ChatBox";

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

			<ChatBox></ChatBox>

		</Layout>
    );
};

export default ChatPage;