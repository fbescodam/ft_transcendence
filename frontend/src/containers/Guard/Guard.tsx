/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Guard.tsx                                          :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:48:50 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/05 19:49:54 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

// Imports
/*/////////////////////////////////////////////////////////////////////////////*/

import { Navigate, useLocation, Outlet } from "react-router-dom";

// Container
/*/////////////////////////////////////////////////////////////////////////////*/

/**
 * Router check that user is authenticated.
 * @returns Navigates either back to login or continues if authenticated.
 */
const Guard = () => {
    const auth = useAuth();
    const location = useLocation();

    // If the user isn't logged in we reroute them to the login page
    if (!auth.isLoggedIn)
	{
        return <Navigate to="/login" state={{from: location}} replace />;
	}
    return <Outlet />;
};

export default Guard;