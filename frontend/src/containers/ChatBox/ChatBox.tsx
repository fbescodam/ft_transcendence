/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   ChatBox.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/08 14:47:58 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/28 16:07:54 by pvan-dij      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Chat from '../../pages/Chat';
import io from 'socket.io-client';
import "./ChatBox.css"
import { isConstructorDeclaration } from 'typescript';

/*/////////////////////////////////////////////////////////////////////////////*/

export interface Message {
    text: string;
	inChannel: string;
}

export interface ChatChannel {
	id: number;
	name: string;
}

/*/////////////////////////////////////////////////////////////////////////////*/

const ChatBox = (props: ChatChannel) => {

	const inputRef = useRef<HTMLInputElement>(null!);
	const [msgList, msgListUpdate] = useState<string[]>([]); //TODO: get messages from db

	let inputValue = '';
	let socket = io("ws://localhost:3000");
	
	useEffect(() => {
		
		//dummy: string[] = [];

		// for (let index = 0; index < 200; index++) {
		// 	dummy.push((Math.random() + 1).toString(36).substring(7));
		// }

		// msgListUpdate(dummy)

		socket.emit('joinRoom', {name: 'Global'})
		//TODO: msg should be and object with everything about that msg, username, date etc.
		socket.on('sendMsg', function(msg) {
			console.log(msg)
			msgListUpdate(prevState => [...prevState, msg]);
		});
	}, []);
	
	useEffect(() => {
		console.log('changed channel');
		msgListUpdate([]);
	}, [props.name]);


	//set input value to msg in form
	function handleChange(event: any) {
		// console.log("Sending ...");
    	inputValue = event.target.value;
  	}

	//on submit send the message to server
	function handleSend(e: any) {
		e.preventDefault();
        if (inputValue) {
			const msg: Message = {text:inputValue, inChannel:"Global"}
          socket.emit('sendMsg', msg);
		  inputRef.current.value = '';
        }
		inputRef.current.scrollTo(0, document.body.scrollHeight)
	}

	function joinRoom(e: any) {
		const room: Object = {name:"Bebou"}
        socket.emit('joinRoom', room);
	}

	return (
		<Container>
			<div className="chat-content">

				{/* Chat display*/}
				<Container>
					<h1>{props.name}</h1>
				</Container>

				{/* Messages */}
				<Container>
					<ul id="messages">
						{msgList.length == 0 && 
							<li style={{opacity: 0.6}} key={`message-${Math.random()}`}>No messages yet...</li>
						}
						{
							msgList.map(msg => 
							<li key={`message-${Math.random()}`}>{msg}</li>)
						}
					</ul>
				</Container>
			
				{/* Send & Input */}
				<form id="chat-form" action="">
					<input ref={inputRef} id="chat-input" onChange={handleChange}/>
					<button className="button-item" onClick={handleSend}>Submit</button>
				</form>
			</div>
		</Container>
	);
};

export default ChatBox;