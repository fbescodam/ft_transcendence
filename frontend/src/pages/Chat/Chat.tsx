/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/27 15:33:28 by pvan-dij      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
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

	// Init once
	useEffect(() => {


	}, []);

	const [openChannel, changeChannel] = useState("Global");

	function clickChannel(channel: string) {
		changeChannel(channel);
	}

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

						<IconButton icon="public" name="Global" callback={() => {clickChannel("Global")}}/>
						<hr />
						<IconButton icon="chat" name="Bebou" callback={() => {clickChannel("Bebou")}}/>
						<IconButton icon="chat" name="Pepin & Pipi & Pepou" callback={() => {clickChannel("Pepin & Pipi & Pepou")}}/>
						<IconButton icon="chat" name="Chat 3" callback={() => {clickChannel("Chat 3")}}/>
						<hr />
						<IconButton icon="add" name="add" callback={() => {}}/>
					</div>

				</Container>

				{/* Channel chatbox */}
				<ChatBox name={openChannel} id={123} />
			</div>

		</Layout>

    );
};

export default ChatPage;