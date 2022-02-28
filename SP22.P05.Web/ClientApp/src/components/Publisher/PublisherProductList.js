import axios from "axios";
import { useState, useEffect } from 'react';
// TODO: Make a list of the products the publisher owns, instead of cards
import { ProductCard } from "../ProductCard";
import { Row } from "react-bootstrap";

export default function PublisherProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.title = "ICE - Publisher Portal"
        async function fetchProducts() {
            axios.get('/api/publisher/products')
                .then(function (response) {
                    console.log(response.data);
                    const data = response.data;
                    setProducts(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        fetchProducts();
    }, [])

    return (
        <>
            <div className="ProductList mx-auto text-break">
                <Row xs={2} md={3} className="g-4" >
                    {products.map((product) => (
                        <ProductCard key={product.id} myProduct={product} />
                    ))
                    }
                </Row>
            </div>
        </>
    );
}

