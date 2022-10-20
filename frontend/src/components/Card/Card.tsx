/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Card.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:05:18 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/10/20 16:37:36 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Card.css"
import React from 'react';
import { Link, Navigate, useLocation } from "react-router-dom";

////////////////////////////////////////////////////////////////////////////////

export interface Properties {
    title: string;
    description: string;
    /** Optional redirect if the card is clicked. */
    href?: string;
    /** Optional Image to show onto the card. */
    image?: string;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A display card with an image, title and text.
 */
 const Card: React.FC<Properties> = ({ title, description, href, image }) => {
    const location = useLocation();

    return (
        <div className="card">
            <Link style={{height: "100%", width: "100%"}} to={href!} state={{from: location}}>
                {image != undefined && <img src={image}/>}
                <span className="title">{title}</span>
                <span className="description">
                    {description}
                </span>
            </Link>
        </div>
    );
};

export default Card;