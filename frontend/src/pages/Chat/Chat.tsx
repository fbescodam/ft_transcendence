/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/22 19:22:29 by pvan-dij      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import ChatBox from "../../containers/ChatBox";

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
				<h1>Chat Page</h1>
			</Container>
			<Container>
				<Container>
					<ul id="messages">
						{
							msgList.map(msg => 
							<li key={`message-${Math.random()}`}>{msg}</li>)
						}
					</ul>
				</Container>
			<form id="form" action="">
				<input ref={inputRef} id="input" onChange={handleChange}/><button onClick={handleSend} type="submit">Send</button>
			</form>
			</Container>
		</Layout>

    );
};

export default ChatPage;