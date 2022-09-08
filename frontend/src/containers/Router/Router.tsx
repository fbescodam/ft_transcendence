/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Router.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:24:56 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/08 16:42:18 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

// Imports
/*/////////////////////////////////////////////////////////////////////////////*/

import Guard from "../Guard/Guard";
import Login from "../../pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "../../pages/Home";
import ChatBox from "../ChatBox";
import Game from "../../pages/Game";

// Container
/*/////////////////////////////////////////////////////////////////////////////*/

const Router = () => (
    <Routes>
        <Route path="/" element={<Home />} />

        {/* TODO: Add guard here to redirect to home we are already logged in */}
        <Route path="/login" element={<Login />} />

        <Route path="/chat" element={<ChatBox />} />
        <Route path="/game" element={<Game />} />

        <Route element={<Guard />}>
            <Route path="profile">
                <Route path=":id" element={<> </>} />
                <Route path="me" element={<> YES U </>} />
            </Route>

            <Route path="/play" element={<> </>} />
            <Route path="/chat" element={<> </>} />
            <Route path="/leaderboard" element={<> </>} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<h1>Not found!</h1>} />
    </Routes>
);

export default Router;