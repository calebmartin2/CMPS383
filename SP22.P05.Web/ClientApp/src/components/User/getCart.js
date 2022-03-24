import axios from "axios";
export default function getCart() {
    const cart = localStorage.getItem('cart');
    var totalCart = [];
    axios.get('/api/user-products/get-cart')
        .then(function (response) {
            var responseCart = response.data.map(String);
            // merge localstorage
            console.log(responseCart);
            console.log(JSON.parse(cart));

            totalCart = responseCart.concat(JSON.parse(cart))
            console.log("CART");
            console.log(totalCart);


        })
        .catch(function (error) {
            console.log(error);
        });
}