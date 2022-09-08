/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Home.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/08 13:44:45 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Home.css"
import React from 'react';
import Container from "../../components/Container";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const HomePage = () => {
    return (
		<Container>
      <h1>Home Page</h1>
    </Container>
    );
};

export default HomePage;