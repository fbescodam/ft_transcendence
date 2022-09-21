/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   App.tsx                                            :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:15 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/05 19:46:38 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Router from "./containers/Router/Router";
import { BrowserRouter } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Router />
		</BrowserRouter>
	);
}

export default App;
