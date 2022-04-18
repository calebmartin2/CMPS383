import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cartContext = React.createContext(null);
const cart = "cart";
export default cartContext;

export function CartItemProvider({ children }) {

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
            await AsyncStorage.setItem(cart, item, (error) => {
                if (error != undefined) {

                }
            });
            await setCartItem(item);
            console.log("Saved cart: " + cartItem)

        }, [setCartItem]
    );
    
    const appendCartItem = useCallback(
        async (item) => {
            await AsyncStorage.getItem('cart', (err, result) => {
                if (result !== null) {
                    if (!result.includes(item)) {
                        var newIds = JSON.parse(result).concat(item);
                        console.log(newIds)
                        AsyncStorage.setItem('cart', JSON.stringify(newIds));
                        setCartItem(JSON.stringify(newIds))
                    }
                } else {
                    console.log('Data Not Found');
                    var array = new Array(item)
                    AsyncStorage.setItem('cart', JSON.stringify(array));
                    setCartItem(JSON.stringify(array))
                }
            });
        }, [setCartItem]
    );

    const removeAllItemCart = useCallback(
        async (item) => {
            AsyncStorage.removeItem('cart')
            setCartItem(null);
        }, [setCartItem]
    );

    const removeItemCart = useCallback(
        async (item) => {
            console.log("REMOVING SINGLE ITEM: " + item)
            await AsyncStorage.getItem('cart', (err, result) => {
                var array = JSON.parse(result)
                var filteredArray = array.filter(e => parseInt(e) !== item)
                setCartItem(JSON.stringify(filteredArray))
                AsyncStorage.setItem('cart', JSON.stringify(filteredArray))
            });
        }, [setCartItem]
    );

    const context = {
        cartItem,
        saveCartItem,
        appendCartItem,
        removeAllItemCart,
        removeItemCart
    };

    return (
        <cartContext.Provider value={context}>
            {children}
        </cartContext.Provider>
    );
}