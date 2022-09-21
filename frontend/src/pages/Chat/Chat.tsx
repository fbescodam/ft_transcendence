/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Chat.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/21 20:40:53 by pvan-dij      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Chat.css"
import React from 'react';
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
	var socket = io("ws://localhost:3000");

	function handleChange(event: any) {
    	inputValue = event.target.value;
  	}

	function handleSend(e: any) {
		e.preventDefault();
        if (inputValue) {
		  console.log(inputValue);
          socket.emit('chat message', inputValue);
		  (document.getElementById("input") as HTMLInputElement).value = '';
        }
	}
	socket.on('chat message', function(msg) {
		console.log(msg);
        // var item = document.createElement('li');
        // item.textContent = msg;
        // messages.appendChild(item);
        // window.scrollTo(0, document.body.scrollHeight);
    });

    return (
		<Layout>
			<Container>
				<h1>Chat Page</h1>
			</Container>
			<ChatBox></ChatBox>
			<ul id="messages"></ul>
			<form id="form" action="">
				<input id="input" onChange={handleChange}/><button onClick={handleSend} type="submit">Send</button>
			</form>
		</Layout>

    );
};

export default ChatPage;