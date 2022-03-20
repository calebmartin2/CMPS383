import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useNavigate } from "react-router-dom";
import { checkForRoleBool } from "./checkForRole";
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
            console.error("ERROR");
        } else if (allCart.includes(productId)) {
            console.log("HAS IN CART");
            setInCart(true);
        }
        axios.get('/api/products/' + productId)
            .then(function (response) {
                setLoading(true);
                console.log(response.data);
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
                    {/* <Button variant="primary" onClick={() => localStorage.setItem("cart", JSON.stringify(localStorage.setItem(product.id)))}>Add to cart</Button> */}
                    {checkForRoleBool("User") ? inCart ? <Button variant="primary" onClick={() => navigate("/cart", { replace: true })}>In cart</Button> : <Button variant="primary" onClick={() => handleAddCart()}>Add to cart</Button> : null}
                    {product.isInLibrary && "IN LIBRARY"}
                </>

                : <NotFoundPage />}
        </>

    )
} 