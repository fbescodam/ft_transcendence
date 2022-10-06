/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   GameContext.tsx                                    :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:30:16 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/10/06 15:45:30 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

// Imports
/*/////////////////////////////////////////////////////////////////////////////*/

import { createContext, useContext, useState } from "react";

type ReactDispatch<Type> = React.Dispatch<React.SetStateAction<Type>> | null;

// Context
/*/////////////////////////////////////////////////////////////////////////////*/

interface GameContextType {
    score: number[];
    setScore: ReactDispatch<number[]>;
}

const GameContext = createContext<GameContextType>(null!);

// Provider
/*/////////////////////////////////////////////////////////////////////////////*/

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [score, setScore] = useState([0, 0]);

    const value: GameContextType = { score, setScore };
    return (<GameContext.Provider value={value}>{children}</GameContext.Provider>);
};


// Functions
/*/////////////////////////////////////////////////////////////////////////////*/

export const useGame = () => useContext(GameContext);