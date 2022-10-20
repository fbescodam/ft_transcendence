/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   App.tsx                                            :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:15 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/10/20 12:13:50 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./App.css";
import Router from "./containers/Router/Router";
import { BrowserRouter } from "react-router-dom";

/*============================================================================*/

function App() {
	return (
		<BrowserRouter>
			<Router />
		</BrowserRouter>
	);
}

/*============================================================================*/

export default App;
