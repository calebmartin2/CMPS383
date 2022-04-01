
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_COOKIE = "AUTH_COOKIE";
const authCookieContext = React.createContext(null);
export default authCookieContext;

export function AuthCookieProvider({ children }) {
    const [authCookie, setAuthCookie] = useState(null);

    useEffect(() => {
        const getAuthCookie = async () => {
            const result = await AsyncStorage.getItem(AUTH_COOKIE);
            if (!result) {
                return;
            }
            setAuthCookie(result);
        }
        getAuthCookie();
    }, [setAuthCookie]);

    const saveAuthCookie = useCallback(
        async (cookie) => {
            console.log("SAVING COOKIE");
            await AsyncStorage.setItem(AUTH_COOKIE, cookie, (error) => {
                if (error != undefined) {

                }
            });
            setAuthCookie(cookie);
        }, [setAuthCookie]
    );

    const context = {
        authCookie,
        saveAuthCookie,
    };

    return (
        <authCookieContext.Provider value={context}>
            {children}
        </authCookieContext.Provider>
    );

}