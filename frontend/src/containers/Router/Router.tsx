/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Router.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:24:56 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 17:46:03 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

// Imports
/*/////////////////////////////////////////////////////////////////////////////*/

import Guard from "../Guard/Guard";
import Login from "../../pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "../../pages/Home";
import Game from "../../pages/Game";
import Chat from "../../pages/Chat";
import NoPage from "../../pages/NotFound/NotFound";
import Leaderboard from "../../pages/Leaderboard";
import Settings from "../../pages/Settings";

// Container
/*/////////////////////////////////////////////////////////////////////////////*/

const Router = () => (
    <Routes>
        <Route path="/" element={<Home />} />

        {/* TODO: Add guard here to redirect to home we are already logged in */}
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/game" element={<Game />} />
		<Route path="/leaderboard" element={<Leaderboard />} />
		<Route path="/settings" element={<Settings />} />

        <Route element={<Guard />}>
            <Route path="profile">
                <Route path=":id" element={<> </>} />
            </Route>

            <Route path="/play" element={<> </>} />
            <Route path="/chat" element={<> </>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NoPage/>} />
    </Routes>
);

export default Router;