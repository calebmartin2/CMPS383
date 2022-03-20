import { handleCartView } from "./checkForRole";
import { useEffect } from "react";
export default function Cart() {
    const cart = localStorage.getItem('cart');
    useEffect(() => {
        document.title = "ICE - Cart"
    }, []);
    return (
        <>
        {/* Bad idea to hardcode, fix later */}
            {handleCartView()}
            <h1>CART</h1>
            {JSON.parse(cart)}

        </>
    )
}