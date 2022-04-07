import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "../NotFoundPage";
import { useNavigate } from "react-router-dom";
import { checkForRole } from "../Auth/checkForRole";
import { ProductCarousel } from "./Carousel";
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
        setLoading(true);
        axios.get('/api/products/' + productId)
            .then(function (response) {
                const data = response.data;
                console.log(data);
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
            return <Button variant="success" onClick={() => navigate("/library", { replace: false })}>In Library</Button>
        }
        if (!checkForRole("User") || localStorage.getItem("user") === null) {
            if (inCart) {
                return <Button variant="primary" onClick={() => navigate("/cart", { replace: false })}>In cart</Button>
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
                    <Row>
                        <Col lg={8} xs={12}>
                            {console.log("PIC2 " + product.pictures)}
                            < ProductCarousel pictures={product.pictures}/>
                        </Col>
                        <Col>
                            <p>Publisher: {product.publisherName}</p>
                            <p>{product.description}</p>
                            <p>${product.price.toFixed(2)} <AddToCartButton /></p>
                        </Col>
                    </Row>

                </>

                : <NotFoundPage />}
        </>

    )
} 