import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, CloseButton, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { checkForRole, handleCartView } from "../Auth/checkForRole";

export default function Cart({ setAmountCart }) {
    const cart = localStorage.getItem('cart');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
            })
            .catch(function (error) {
                setLoading(false);
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
        if (checkForRole('User')) {
            navigate("/Login", { replace: true });
            return
        }
        window.confirm("Are you sure you want to purchase these items for $" + calculateTotal() + "?") &&
        axios({
            url: '/api/user-products/add-to-account',
            method: 'post',
            data: tempCart
        })
            .then(function (response) {
                localStorage.removeItem("cart")
                setAmountCart(0);
                navigate('/receipt', { state: { products: products } });

            })
            .catch(function (error) {
            });
    }
    function RenderNoItems() {
        return (
            <>
                <p>No items in cart</p>
                <Button onClick={() => { navigate("/", { replace: false }) }}>Continue Shopping</Button>
            </>
        )
    }
    return (
        <>
            {/* Bad idea to hardcode, fix later */}
            {handleCartView()}
            <h1>CART</h1>
            {loading ? <Spinner animation="border" variant="info" /> : products.length !== 0 ?
                <div>
                    {products.map((product) => (
                        <div key={product.id}>
                            <Card style={{ margin: "1em" }} className="blue-border" bg="black" text="white">
                                <Card.Body><Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: '#FFF'}}><Card.Img style={{
                                    height: "5em", width: "5em", marginRight: "1em"
                                }} src={product.iconName} /> {product.name}</Link>
                                    <span style={{ float: "right", paddingTop: "2em"}}>${product.price.toFixed(2)}
                                        <CloseButton style={{ float: "right" }} variant="white" onClick={() => removeItemCart(product.id)}></CloseButton>
                                    </span>
                                </Card.Body>
                            </Card>
                        </div>
                    ))
                    }
                    <Card bg="black" text="white" >
                        <Card.Body> <span style={{ float: "right" }}>Total: ${calculateTotal()} </span></Card.Body>
                    </Card>
                    <Button variant="success" style={{ float: "right", margin: "1em" }} onClick={() => { buyItems() }}>Buy Now</Button>
                    <Button style={{ float: "right", margin: "1em" }} onClick={() => { navigate("/", { replace: false }) }}>Continue Shopping</Button>
                    <p style={{ color: "#888", textDecoration: "underline", width: "fit-content"}} onClick={() => removeAllItemCart()}>Remove All Items</p>
                </div>
                : <RenderNoItems />
            }
        </>
    )
}
