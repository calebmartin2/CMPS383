import axios from "axios";
import syncCart from "./syncCart";
export default function getCart() {
    const cart = localStorage.getItem('cart');
    var totalCart = [];
    axios.get('/api/user-products/get-cart')
        .then(function (response) {
            totalCart = response.data.concat(JSON.parse(cart))
            //https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
            var filtered = totalCart.filter(function (el) {
                return el != null;
            });
            filtered = filtered.map(String);
            syncCart(filtered);
        })
        .catch(function (error) {
            console.log(error);
        });
}