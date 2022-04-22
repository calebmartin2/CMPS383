import axios from "axios";
import { uniq } from "lodash";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../../components/NotFoundPage";
import { checkForRole } from "../Auth/checkForRole";
import { ProductCarousel } from "./Carousel";
export function ProductDetail({ setAmountCart }) {
    let navigate = useNavigate();

    let { productId } = useParams();
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [inCart, setInCart] = useState(false);

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
                setProduct(data);
                setLoading(false);
                document.title = "ICE - " + response.data.name
            })
            .catch(function (error) {
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
        localStorage.setItem("cart", JSON.stringify(uniq(allCart)));
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
        return <Button variant="primary" disabled>Add to cart</Button>

    }

    return (
        <>
            {loading ?  <Spinner animation="border" variant="info" /> : product ?
                <>
                    {((Number(product.status) === 2)) && <h3 style={{backgroundColor: "#5c3a00", color: "#ffb029", padding: "0.2em", borderRadius: "0.2em"}}>Product Under Review</h3>}
                    {((Number(product.status) === 1)) && <h3 style={{backgroundColor: "#5c3a00", color: "#ffb029", padding: "0.2em", borderRadius: "0.2em"}}>Product Not For Sale</h3>}
                    <h1 style={{ fontWeight: "700", overflowWrap: "break-word" }}>{product.name}</h1>
                    <Row>
                        <Col lg={8} xs={12}>
                            < ProductCarousel pictures={product.pictures}/>
                        </Col>
                        <Col>
                            <p>Publisher: {product.publisherName}</p>
                            <p>{product.description}</p>
                            <div style={{background: "rgb(33 37 41)", padding: "1em", width: "fit-content", borderRadius: "0.5em"}}>
                                <span style={{marginRight: "1em"}}>${product.price.toFixed(2)}</span>
                                <AddToCartButton />
                            </div>
                        </Col>
                    </Row>
                </>
                : <NotFoundPage />}
        </>

    )
} 