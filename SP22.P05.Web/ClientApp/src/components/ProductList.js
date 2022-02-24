import axios from "axios";
import { useState, useEffect } from 'react';
import { ProductCard } from "./ProductCard";
import { Card, Row, Col } from "react-bootstrap";
import './ProductList.css'

export function ProductList() {

    const [products, setProducts] = useState([]);


    useEffect(() => {
        async function fetchProducts() {
            axios.get('/api/products')
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
            <div className="ProductList">
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

