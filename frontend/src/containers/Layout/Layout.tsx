/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Layout.tsx                                         :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/19 14:20:05 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 14:29:03 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import Navbar from "../Navbar";
import "./Layout.css"

////////////////////////////////////////////////////////////////////////////////

interface Properties {
    children: React.ReactNode;
};

////////////////////////////////////////////////////////////////////////////////

const Layout: React.FC<Properties> = ({ children }) => {
    return (
        <div className="layout-container">
            <Navbar/>
			<div className="layout-content">
				{children}
			</div>
        </div>
    );
};

export default Layout;