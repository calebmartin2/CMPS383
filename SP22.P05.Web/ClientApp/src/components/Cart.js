import { handleCartView } from "./checkForRole";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
    const cart = localStorage.getItem('cart');
    const [products, setProducts] = useState([]);
	document.title = "ICE - Cart"
    useEffect(() => {
        var tempCart = JSON.parse(cart);
        axios({
            url: '/api/products/select',
            method: 'post',
            data: tempCart
        })
            .then(function (response) {
                setProducts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [cart]); //might need to change dependency array
    return (
        <>
            {/* Bad idea to hardcode, fix later */}
            {handleCartView()}
            <h1>CART</h1>
            <div>
                {products.map((product) => (
                    <p key={product.id}>{product.name} {product.price.toFixed(2)}</p>
                ))
                }
            </div>
            {/* API endpoint to buy is /api/user-products-add-to-account. Use same type of call as /api/products/select */}
        </>
    )
}
