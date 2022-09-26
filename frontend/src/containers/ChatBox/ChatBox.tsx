/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   ChatBox.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/08 14:47:58 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/26 15:02:17 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';
import "./ChatBox.css"

/*/////////////////////////////////////////////////////////////////////////////*/

export interface Message {

}

export interface Chat {
	id: number;
}

/*/////////////////////////////////////////////////////////////////////////////*/

const ChatBox = () => {

	const inputRef = useRef<HTMLInputElement>(null!);
	const [msgList, msgListUpdate] = useState<string[]>(["null!"]);

	useEffect(() => {

		let dummy: string[] = [];

		for (let index = 0; index < 200; index++) {
			dummy.push((Math.random() + 1).toString(36).substring(7));
		}

		msgListUpdate(dummy)
	}, []);


	function handleChange(event: any) {
		console.log("Sending ...")
  	}

	function handleSend() {

	}

	return (
		<Container>
			<div className="chat-content">

				{/* Chat display*/}
				<Container>
					<h1>Chat room name</h1>
				</Container>

				{/* Messages */}
				<Container>
					<ul id="messages">
						{
							msgList.map(msg => 
							<li key={`message-${Math.random()}`}>{msg}</li>)
						}
					</ul>
				</Container>
			
				{/* Send & Input */}
				<form id="chat-form" action="">
					<input ref={inputRef} id="chat-input" onChange={handleChange}/>
					<Button type="submit" callback={() => { handleSend() }}>Send</Button>
				</form>
			</div>
		</Container>
	);
};

export default ChatBox;