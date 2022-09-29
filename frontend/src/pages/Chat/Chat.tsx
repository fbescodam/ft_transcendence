/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/29 16:25:05 by pvan-dij      ########   odam.nl         */
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

export interface ChatChannel {
	id: number;
	messages: string[];
	name: string;
	users: string[];
}

/**
 * A button with a text value, a callback and possibly an icon.
 */
const ChatPage = () => {

	const [channel, setChannel] = useState<ChatChannel>(null!); // TODO: Default to global
	const [channels, setChannels] = useState<ChatChannel[]>([]);

	// Should take in type of ChatChannel configure with variables
	// Use the setChannels array like shown below
	const addChannelHandeler = (newChatChannel: ChatChannel) => {
		setChannels((prevState) => [...prevState, channel]);
	};

	// Init
	useEffect(() => {
		let dummy: ChatChannel[] = [];

		for (let index = 0; index < 20; index++) {
			dummy.push({ id: index, messages: [], name: (Math.random() + 1).toString(36).substring(7), users: [] });
		}
		console.log("Adding channel...");
		setChannels(dummy);
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
							<IconButton
								icon="public"
								name="Global"
								callback={() => {}}
							/>
							<hr />
							<div className="channel-container">
								{channels.map((value: ChatChannel) => {
									return (
										<IconButton
											key={value.id}
											icon="chat"
											name={value.name}
											callback={() => {clickChannel(value.name)}}
										/>
									);
								})}
							</div>
							<hr />
							<IconButton
								icon="add"
								name="add"
								callback={() => {
									// TODO: Popup a Modal
									addChannelHandeler({id: 12, messages: [], name: "Doo", users: []});
								}}
							/>
						</div>
					</Container>

				{/* Channel chatbox */}
				<ChatBox name={openChannel} id={123} />
			</div>

		</Layout>

    );
};

export default ChatPage;
