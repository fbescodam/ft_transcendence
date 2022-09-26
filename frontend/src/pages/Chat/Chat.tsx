/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 14:16:31 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React from 'react';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import ChatBox from "../../containers/ChatBox";
import NavItem from "../../components/NavItem";
import IconButton from "../../components/IconButton";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const ChatPage = () => {
    return (
		<Layout>
			<Container>
				<header>
					<h1>Chat Page</h1>
				</header>
			</Container>

			<div>
				{/* Channel selection */}
				<Container>
					<div className="channel-selection">

						{/* TODO: Replace these, and sync style with NavItem maybe */}

						<IconButton icon="public" name="Global" callback={() => {}}/>
						<hr />
						<IconButton icon="chat" name="Bebou" callback={() => {}}/>
						<IconButton icon="chat" name="Pepin & Pipi & Pepou" callback={() => {}}/>
						<IconButton icon="chat" name="Chat 3" callback={() => {}}/>
						<hr />
						<IconButton icon="add" name="add" callback={() => {}}/>
					</div>

				</Container>

				{/* Channel chatbox */}
				<ChatBox />
			</div>

		</Layout>
    );
};

export default ChatPage;