/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/27 15:06:59 by pvan-dij      ########   odam.nl         */
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

	//TODO: get msgs from database and display
	let [msgList, msgListUpdate] = useState<string[]>(["Start your chat!"])
	let inputRef = useRef<HTMLInputElement>(null!);

	// Init once
	useEffect(() => {
		//TODO: msg should be and object with everything about that msg, username, date etc.
		socket.on('chat message', function(msg) {
			console.log(msg)
			msgListUpdate(prevState => [...prevState, msg]);
		});

	}, []);

	let inputValue = '';
	let socket = io("ws://localhost:3000");

	function handleChange(event: any) {
    	inputValue = event.target.value;
  	}

	function handleSend(e: any) {
		e.preventDefault();
        if (inputValue) {
          socket.emit('chat message', inputValue);
		  inputRef.current.value = '';
        }
		inputRef.current.scrollTo(0, document.body.scrollHeight)
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