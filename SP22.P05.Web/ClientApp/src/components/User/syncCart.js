// import axios from "axios";
// export default function syncCart(var cart) {
//     const cart = localStorage.getItem('cart');
//     var tempCart = JSON.parse(cart);
//     axios({
//         url: '/api/user-products/add-to-account',
//         method: 'post',
//         data: tempCart
//     })
//         .then(function (response) {
//             console.log(response);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }