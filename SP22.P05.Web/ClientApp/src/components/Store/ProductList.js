import axios from "axios";
import { useState, useEffect } from 'react';
import { ProductCard } from "./ProductCard";
import { Row } from "react-bootstrap";
import './ProductList.css'

export function ProductList({search}) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.title = "ICE - Store"
        setLoading(true);
        async function fetchProducts() {
            axios.get('/api/products', {
                params: {query: search}
            })
                .then(function (response) {
                    console.log(response.data);
                    const data = response.data;
                    setProducts(data);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        fetchProducts();
    }, [search])

    return (
        <>
            {loading
            ? <h2>Loading...</h2>
                : <div className="ProductList mx-auto text-break">
                    <Row xs={1} md={2} lg={3} className="g-4" >
                        {products.map((product) => (
                            <ProductCard key={product.id} myProduct={product} />
                        ))
                        }
                    </Row>
                </div>}
        </>
    );
}

