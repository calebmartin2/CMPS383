import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Form, FormControl, Row } from "react-bootstrap";
import { handleCartView } from "../Auth/checkForRole";
import { ProductCardLibrary } from "./ProductCardLibrary";
export default function UserLibrary() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        document.title = "ICE - Library"
        axios({
            signal: controller.signal,
            url: '/api/products/library',
            params: { query: search },
            method: 'get',
        })
            .then(function (response) {
                setLoading(false);
                setProducts(response.data);

            })
            .catch(function (error) {
                setLoading(false);
                console.log(error);
            });
        return () => {
            controller.abort();
        }
    }, [search]);

    return (
        <>
            {loading
                ? <h2>Loading...</h2>
                : <>{handleCartView()}
                    <Row>
                        <Col xs={4} md={6} lg={8}>
                            <h1>LIBRARY</h1>
                        </Col>
                        <Col xs={8} md={6} lg={4}>
                            <Form className="d-flex" onSubmit={e => { e.preventDefault() }}>
                                <FormControl
                                    type="text"
                                    placeholder="Search"
                                    className="me-2"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
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
                    </div></>}
        </>
    )
}





