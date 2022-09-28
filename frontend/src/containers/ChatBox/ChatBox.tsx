/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   ChatBox.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/08 14:47:58 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/28 16:30:49 by pvan-dij      ########   odam.nl         */
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
	text: string,
	inChannel: string,
	sentAt?: Date, //TODO: optional for now, cant be fucked
}
export interface ChatChannel {
	id: number,
	name: string,
}

/*/////////////////////////////////////////////////////////////////////////////*/

const ChatBox = (props: ChatChannel) => {

	const inputRef = useRef<HTMLInputElement>(null!);
	const [msgList, msgListUpdate] = useState<string[]>([]); //TODO: get messages from db

	let inputValue = '';
	let socket = io("ws://localhost:3000");
	
	useEffect(() => {
		
		//just joining global by default for now
		joinRoom();

		//TODO: msg should be an object with everything about that msg, username, date etc.
		socket.on('sendMsg', function(msg) {
			console.log(msg)
			msgListUpdate(prevState => [...prevState, msg]);
		});
	}, []);
	
	//When the channel name changes swap out messagelist
	useEffect(() => {
		console.log('changed channel');
		msgListUpdate([]); //TODO: get messages from corresponding channel instead of just clearing it
	}, [props.name]);


	//set input value to msg in form
	function handleChange(event: any) {
		// console.log("Typing ...");
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


	//do with these what you will
	function joinRoom() {
		const room: Object = {name:"Global"}
        socket.emit('joinRoom', room);
	}

	function leaveRoom() {
		const room: Object = {name:"Global"}
        socket.emit('leaveRoom', room);
	}

	function createRoom() {
		const room: Object = {name:"Penis"}
        socket.emit('createRoom', room);
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
							<li key={`message-${Math.random()}`}>{msg}</li>) //TODO: this should be a message component with username, avatar, etc...
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