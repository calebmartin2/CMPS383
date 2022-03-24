import axios from "axios";
export default function initialCart({setAmountCart}) {
    const cart = localStorage.getItem('cart');
    var totalCart = [];
    console.log("G1")
    axios.get('/api/user-products/get-cart')
        .then(function (response) {
            totalCart = response.data.concat(JSON.parse(cart))
            //https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
            var filtered = totalCart.filter(function (el) {
                return el != null;
            });
            filtered = filtered.map(String);
            filtered = [...new Set(filtered)];
            // console.log(cart)
            axios({
                url: '/api/user-products/sync-cart',
                method: 'post',
                data: filtered
            })
                .then(function (response) {
                    localStorage.setItem("cart", JSON.stringify(response.data.map(String)));
                    setAmountCart(response.data.length)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }).catch(function (error) {
            console.log(error);
        });


}