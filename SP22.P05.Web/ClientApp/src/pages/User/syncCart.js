import axios from "axios";
export default function syncCart(cart) {
    // ensure cart is unique (no duplicates)
    cart = [...new Set(cart)];
    axios({
        url: '/api/user-products/sync-cart',
        method: 'post',
        data: cart
    })
        .then(function (response) {
            localStorage.setItem("cart", JSON.stringify(response.data.map(String)));
        })
        .catch(function (error) {
        });
}