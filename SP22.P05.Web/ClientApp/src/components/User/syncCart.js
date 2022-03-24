import axios from "axios";
export default function syncCart(cart, ) {
    console.log("SYNCART")
    // ensure cart is unique (no duplicates)
    cart = [...new Set(cart)];
    console.log(cart)
    axios({
        url: '/api/user-products/sync-cart',
        method: 'post',
        data: cart
    })
        .then(function (response) {
            localStorage.setItem("cart", JSON.stringify(response.data.map(String)));
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}