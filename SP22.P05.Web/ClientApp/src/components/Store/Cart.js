import { checkForRole, handleCartView } from "../Auth/checkForRole";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Cart({ setAmountCart }) {
    const cart = localStorage.getItem('cart');
    const [products, setProducts] = useState([]);
    let navigate = useNavigate();

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

    function removeItemCart(id) {
        var allCart = JSON.parse(localStorage.getItem("cart"));
        if (allCart == null) {
            return;
        }
        // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
        allCart = allCart.filter(item => item !== id.toString());
        localStorage.setItem("cart", JSON.stringify(allCart));
        setAmountCart(allCart.length);

    }

    function removeAllItemCart() {
        localStorage.removeItem("cart")
        setAmountCart(0);
        setProducts([]);

    }
    function calculateTotal() {
        var sum = 0;
        products.forEach(element => {
            sum += element.price;
        });
        return sum.toFixed(2);
    }

    function buyItems() {
        var tempCart = JSON.parse(cart);
        if(checkForRole('User')){
            navigate("/Login", { replace: true });
        }
        axios({
            url: '/api/user-products/add-to-account',
            method: 'post',
            data: tempCart
        })
            .then(function (response) {
                console.log(response);
                // Redirect to receipt screen
                removeAllItemCart()
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <>
            {/* Bad idea to hardcode, fix later */}
            {handleCartView()}
            <h1>CART</h1>
            {products.length !== 0 ?
                <div>
                    {products.map((product) => (
                        <div key={product.id}>
                            <p>{product.name} ${product.price.toFixed(2)}</p>
                            <Button variant="danger" onClick={() => removeItemCart(product.id)}>Remove Item</Button>
                        </div>
                    ))
                    }
                    <Button variant="danger" onClick={() => removeAllItemCart()}>Remove All Items</Button>
                    <Button onClick={() => buyItems()}>Buy Items</Button>
                    <p>Total Amount: ${calculateTotal()}</p>

                </div>
                : <p>No items in cart</p>}
            {/* API endpoint to buy is /api/user-products-add-to-account. Use same type of call as /api/products/select */}
        </>
    )
}
