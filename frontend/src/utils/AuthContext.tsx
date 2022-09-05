/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   AuthContext.tsx                                    :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:30:16 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/05 20:59:57 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

// Imports
/*/////////////////////////////////////////////////////////////////////////////*/

import { Profile } from "./Types";
import { createContext, useContext, useState } from "react";

// Context
/*/////////////////////////////////////////////////////////////////////////////*/

interface AuthContextType {
    user: Profile | null;
    isLoggedIn: boolean;
    signin: (loginData: any) => any; // TODO: Define login data type (Username + hashed PW)
    signout: VoidFunction;
}

const AuthContext = createContext<AuthContextType>(null!);

// Provider
/*/////////////////////////////////////////////////////////////////////////////*/

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Profile>(null!);
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

    const signin = () => {
		return {};
    };

    const signout = () => {
    };

    const value: AuthContextType = { user, signin, signout, isLoggedIn };

    return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};


// Functions
/*/////////////////////////////////////////////////////////////////////////////*/

export const useAuth = () => useContext(AuthContext);