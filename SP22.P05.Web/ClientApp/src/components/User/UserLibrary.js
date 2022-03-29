import axios from "axios";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { ProductCardLibrary } from "./ProductCardLibrary";
import { handleCartView } from "../Auth/checkForRole";
export default function UserLibrary() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.title = "ICE - Library"
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
            {handleCartView()}

            <h1>LIBRARY</h1>
            <div className="ProductList mx-auto text-break">
                <Row xs={2} md={3} className="g-4" >
                    {products.map((product) => (
                        <ProductCardLibrary key={product.id} myProduct={product} />
                    ))
                    }
                </Row>
            </div>
        </>
    )
}





