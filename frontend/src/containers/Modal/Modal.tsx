/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Modal.tsx                                          :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/19 14:20:05 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/29 15:38:09 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Modal.css"
import Container from "../../components/Container";

////////////////////////////////////////////////////////////////////////////////

interface Properties {
    children: React.ReactNode;
};

////////////////////////////////////////////////////////////////////////////////

const Layout: React.FC<Properties> = ({ children }) => {
    return (
        <div className="modal">
            <Container>
                {children}
            </Container>
        </div>
    );
};

export default Layout;