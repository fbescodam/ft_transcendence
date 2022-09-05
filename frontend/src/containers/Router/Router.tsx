/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Router.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:24:56 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/05 20:59:36 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

// Imports
/*/////////////////////////////////////////////////////////////////////////////*/

import { Routes, Route } from "react-router-dom";

import Guard from "../Guard/Guard";

// Container
/*/////////////////////////////////////////////////////////////////////////////*/

const Router = () => (
    <Routes>
        {/* Public routes */}
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/login" element={<> </>} />

        {/* Pong debugging */}
        <Route path="/pong" element={<> </>} />
        <Route path="/new-pong" element={<> </>} />

        {/* Routes that have to pass through authentication to be loaded */}
        <Route element={<Guard />}>
            {/* Profile page is rendered in two different ways but same component */}
            <Route path="profile">
                <Route path=":id" element={<> </>} />
                <Route path="me" element={<> </>} />
            </Route>

            {/* Regular private routes */}
            <Route path="/play" element={<> </>} />
            <Route path="/chat" element={<> </>} />
            <Route path="/leaderboard" element={<> </>} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<h1>Not found!</h1>} />
    </Routes>
);

export default Router;