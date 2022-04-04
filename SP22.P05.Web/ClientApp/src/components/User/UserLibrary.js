import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, FormControl, Row } from "react-bootstrap";
import { handleCartView } from "../Auth/checkForRole";
import { ProductCardLibrary } from "./ProductCardLibrary";
export default function UserLibrary() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

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

    function handleSearch() {

    }

    return (
        <>
            {handleCartView()}
            <Row>
                <Col xs={4} md={6} lg={8}>
                    <h1>LIBRARY</h1>
                </Col>
                <Col xs={8} md={6} lg={4}>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="outline-success" onClick={handleSearch} >Search</Button>
                    </Form>
                </Col>
            </Row>
            <div className="ProductList mx-auto text-break">
                <Row xs={1} md={2} lg={3} className="g-4" >
                    {products.map((product) => (
                        <ProductCardLibrary key={product.id} myProduct={product} />
                    ))
                    }
                </Row>
            </div>
        </>
    )
}





