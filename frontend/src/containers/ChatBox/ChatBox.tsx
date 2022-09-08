/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   ChatBox.tsx                                        :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/08 14:47:58 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/08 15:18:10 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import React from 'react';
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
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
                        <p>Stuff</p>
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