/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   NotFound.tsx                                       :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 14:47:06 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./NotFound.css"
import React from 'react';
import Layout from "../../containers/Layout";
import Container from "../../components/Container";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const NoPage = () => {
    return (
		<Layout>
			<Container>
				<h1>Page not found</h1>
			</Container>
		</Layout>
    );
};

export default NoPage;