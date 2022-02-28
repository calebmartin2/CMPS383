import axios from "axios";
import { useState, useEffect } from 'react';
import { Table } from "react-bootstrap";

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
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                    </tr>
                ))
                }
                </tbody>
            </Table>

        </>
    );
}

