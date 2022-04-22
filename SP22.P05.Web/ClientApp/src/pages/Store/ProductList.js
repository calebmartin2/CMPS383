import axios from "axios";
import { useEffect, useState } from 'react';
import { Row, Spinner } from "react-bootstrap";
import { ProductCard } from "./ProductCard";
import './ProductList.css';

export function ProductList({search, sortOrder}) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    
    useEffect(() => {
        if (localStorage.getItem('cart')) {
            setCart(JSON.parse(localStorage.getItem('cart')).map(Number));
        }
    },[])

    useEffect(() => {
        document.title = "ICE - Store"
        setLoading(true);
        async function fetchProducts() {
            axios.get('/api/products', {
                params: {query: search, sortOrder: sortOrder}
            })
                .then(function (response) {
                    const data = response.data;
                    setProducts(data);
                    setLoading(false);
                })
                .catch(function (error) {
                });
        }
        fetchProducts();
    }, [search, sortOrder]);

    return (
        <> 
            {loading
            ? <Spinner animation="border" variant="info" />
                : <div className="ProductList mx-auto text-break">
                    {((products.length === 0) && search) && <h3 style={{color: "lightGray"}}>No results were returned for that query.</h3>}
                    <Row xs={1} md={2} lg={3} className="g-4" >
                        {products.map((product) => (
                            <ProductCard key={product.id} myProduct={product} cart={cart} />
                        ))
                        }
                    </Row>
                </div>}
        </>
    );
}

