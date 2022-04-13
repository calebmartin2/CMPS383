import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cartContext = React.createContext(null);
const cart = "cart";
export default cartContext;

export function CartItemProvider({children}) {

    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        const getCartItem = async () => {
            const result = await AsyncStorage.getItem("cart");
            if (!result) {
                return;
            }
            setCartItem(result);
        }
        getCartItem();
    }, [setCartItem]);

    const saveCartItem = useCallback(
        async (item) => {
            console.log("SAVING CART");
            await AsyncStorage.setItem(cart, item, (error) => {
                if (error != undefined) {

                }
            });
            setCartItem(item);
        }, [setCartItem]
    );

    const context = {
        cartItem,
        saveCartItem,
    };

    return (
        <cartContext.Provider value={context}>
            {children}
        </cartContext.Provider>
    );
}