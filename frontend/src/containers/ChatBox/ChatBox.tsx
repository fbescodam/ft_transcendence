/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   ChatBox.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/08 14:47:58 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/21 22:08:10 by pvan-dij      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import React from 'react';
import Container from '../../components/Container';
import Chat from '../../pages/Chat';
import io from 'socket.io-client';
import "./ChatBox.css"
import { isConstructorDeclaration } from 'typescript';

/*/////////////////////////////////////////////////////////////////////////////*/

export interface Message {
    text: string;
}

export interface Chat {
    id: number;
    msgList: string[]
}

/*/////////////////////////////////////////////////////////////////////////////*/

const ChatBox = () => {

    let messages: Chat = {
        id: 0,
        msgList: []
    };
    
    let listItems = messages.msgList.map((number) =>
    <li>{number}</li>
    );

    function appendMsg(msg: string) {
        messages.msgList.push(msg);
        listItems = messages.msgList.map((number) =>
        <li>{number}</li>
        );
    }
    
	return (
        <Container>
            <div className="chat-content">
                {/* Chat title, display users */}
                <Container>
                    <h1>Title</h1>
                </Container>

                {/* Chat messages */}
                <Container>
                    <div className="chat-body">
                        {listItems}
                    </div>
                </Container>

                {/* Text Input */}
                {/* <form>
                    <input id="chat-message" type="text" placeholder="Send a message ..." />
                    <input type={"submit"}/>
                </form>  */}
            </div>
        </Container>
	);
};

export default ChatBox;