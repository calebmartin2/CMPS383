import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage";
import { useNavigate } from "react-router-dom";
import { checkForRole } from "../Auth/checkForRole";
export function ProductDetail({ setAmountCart }) {
    let navigate = useNavigate();

    let { productId } = useParams();
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [inCart, setInCart] = useState(false);
    var _ = require('lodash');

    useEffect(() => {
        var allCart = JSON.parse(localStorage.getItem("cart"));
        if (!allCart) {
            // If nothing is in cart, do nothing.
        } else if (allCart.includes(productId)) {
            setInCart(true);
        }
        axios.get('/api/products/' + productId)
            .then(function (response) {
                setLoading(true);
                const data = response.data;
                setProduct(data);
                setLoading(false);
                document.title = "ICE - " + response.data.name
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    }, [productId])

    function handleAddCart() {
        var allCart = JSON.parse(localStorage.getItem("cart"));
        if (allCart == null) {
            localStorage.setItem("cart", JSON.stringify([productId]));
            setInCart(true);
            setAmountCart(1);
            return;
        }
        allCart.push(productId);
        //https://stackoverflow.com/questions/31740155/lodash-remove-duplicates-from-array
        localStorage.setItem("cart", JSON.stringify(_.uniqWith(allCart, _.isEqual)));
        setInCart(true);
        setAmountCart(allCart.length);
    }

    function AddToCartButton() {
        if (product.isInLibrary) {
            return <Button variant="success" onClick={() => navigate("/library", { replace: true })}>In Library</Button>
        }
        if (!checkForRole("User")) {
            if (inCart) {
                return <Button variant="primary" onClick={() => navigate("/cart", { replace: true })}>In cart</Button>
            } else {
                return <Button variant="primary" onClick={() => handleAddCart()}>Add to cart</Button>
            }
        }
        return null

    }

    return (
        <>
            {loading ? "Loading..." : product ?
                <>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} to="/" linkProps={{ to: "/" }}>Store</Breadcrumb.Item>
                        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
                    </Breadcrumb>
                    <h1 style={{ fontWeight: "700", overflowWrap: "break-word" }}>{product.name}</h1>
                    <p>Publisher: {product.publisherName}</p>
                    <p>{product.description}</p>
                    <p>${product.price.toFixed(2)}</p>
                    <AddToCartButton />
                </>

                : <NotFoundPage />}
        </>

    )
} 