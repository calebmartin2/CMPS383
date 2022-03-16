import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
export function ProductDetail() {
    let { productId } = useParams();
    const [product, setProduct] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/products/' + productId)
            .then(function (response) {
                setLoading(true);
                console.log(response.data);
                const data = response.data;
                setProduct(data);
                setLoading(false);
                document.title = response.data.name;
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    }, [productId])

    return (
        <>
            {loading ? "Loading..." : product ?
                <>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} to="/" linkProps={{ to: "/" }}>Store</Breadcrumb.Item>
                        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
                    </Breadcrumb>
                    <h1 style={{ fontWeight: "700" }}>{product.name}</h1>
                    <p>Publisher: {product.publisherName}</p>
                    <p>{product.description}</p>
                    <p>${product.price.toFixed(2)}</p>
                </>

                : <NotFoundPage />}
        </>

    )
} 