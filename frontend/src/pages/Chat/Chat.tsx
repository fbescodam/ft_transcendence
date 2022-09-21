/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/21 23:37:51 by pvan-dij      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React, { useState, useRef } from 'react';
import io from 'socket.io-client';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import ChatBox from "../../containers/ChatBox";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
const ChatPage = () => {
	let inputValue = '';
	let socket = io("ws://localhost:3000");
	let inputRef = useRef<HTMLInputElement>(null!);

	function handleChange(event: any) {
    	inputValue = event.target.value;
  	}

	function handleSend(e: any) {
		e.preventDefault();
        if (inputValue) {
          socket.emit('chat message', inputValue);
		  inputRef.current.value = '';
        }
	}
	
	//TODO: get msgs from database and display
	let [msgList, msgListUpdate] = useState([""])
	
	//TODO: msg should be and object with everything about that msg, username, date etc.
	socket.on('chat message', function(msg) {
		//console.log(msg) //enable this to see the secret error
		const penis = [...msgList, msg];
		msgListUpdate(penis);
    });

    return (
		<Layout>
			<Container>
				<h1>Chat Page</h1>
			</Container>
			<ul id="messages">                
				{
					msgList.map(msg => 
					<li key={msg}>{msg}</li>)
				}
			</ul>
			<form id="form" action="">
				<input ref={inputRef} id="input" onChange={handleChange}/><button onClick={handleSend} type="submit">Send</button>
			</form>
		</Layout>

    );
};

export default ChatPage;