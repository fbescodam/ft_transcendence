/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/21 23:18:27 by pvan-dij      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React, { useState } from 'react';
import io from 'socket.io-client';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import ChatBox from "../../containers/ChatBox";
import { setConstantValue } from "typescript";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
const ChatPage = () => {
	let inputValue = '';
	var socket = io("ws://localhost:3000");

	function handleChange(event: any) {
    	inputValue = event.target.value;
  	}

	function handleSend(e: any) {
		e.preventDefault();
        if (inputValue) {
		//   console.log(inputValue);
          socket.emit('chat message', inputValue);
		  (document.getElementById("input") as HTMLInputElement).value = '';
        }
	}
	
	let [msgList, msgListUpdate] = useState([""])
	socket.on('chat message', function(msg) {
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
				<input id="input" onChange={handleChange}/><button onClick={handleSend} type="submit">Send</button>
			</form>
		</Layout>

    );
};

export default ChatPage;