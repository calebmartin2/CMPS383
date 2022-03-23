import axios from "axios";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { ProductCard } from "../Store/ProductCard";
export default function UserLibrary() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios({
            url: '/api/products/library',
            method: 'get',
        })
            .then(function (response) {
                setProducts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);

    return (
        <>
            <h1>LIBRARY</h1>
                <div className="ProductList mx-auto text-break">
                    <Row xs={2} md={3} className="g-4" >
                        {products.map((product) => (
                            <ProductCard key={product.id} myProduct={product} />
                        ))
                        }
                    </Row>
            </div>
        </>
    )
}





