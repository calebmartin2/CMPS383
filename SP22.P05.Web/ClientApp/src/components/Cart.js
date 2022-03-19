import { handleCartView } from "./checkForRole";

export default function Cart() {
    const cart = localStorage.getItem('cart');

    return (
        <>
        {/* Bad idea to hardcode, fix later */}
            {handleCartView()}
            <h1>CART</h1>
            {JSON.parse(cart)}

        </>
    )
}