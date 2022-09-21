/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Settings.tsx                                       :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 19:16:39 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Settings.css";
import React from "react";
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import Button from "../../components/Button";

/*////////////////////////////////////////////////////////////////////////////*/

/**
 *
 */
const SettingsPage = () => {
	return (
		<Layout>
			<Container>
				<h1>Settings</h1>
			</Container>

			<Container>
				<form method="POST">
					<fieldset>
						<legend>User Data</legend>
						<div>
							<label>Username:</label>
							<input type="text" />
						</div>

						<div>
							<label htmlFor="gender">Gender:</label>
							<select>
								<option>Male</option>
								<option>Female</option>
							</select>
						</div>

						<Button type="submit">Save</Button>
					</fieldset>
				</form>

				<form method="POST">
					<fieldset>
						<legend>Authentication</legend>

						<div>
							<label htmlFor="token">Please enter the code you were sent:</label>
							<input
								type="text"
								name="token"
								id="token"
								inputMode="numeric"
								pattern="[0-9]*"
								autoComplete="one-time-code"
							/>
						</div>

						<Button type="submit">
							Submit
						</Button>
					</fieldset>
				</form>
			</Container>
		</Layout>
	);
};

export default SettingsPage;
