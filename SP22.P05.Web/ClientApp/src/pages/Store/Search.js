import { useEffect, useState } from "react";
import { Button, Form, FormControl, Row, Col, Breadcrumb } from "react-bootstrap";
import { ProductList } from "./ProductList";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export function Search() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    useEffect(() => {
        console.log(query)
        if (query) {
            setSearch(query);
        }
    }, [query]);

    function handleSearch(e) {
        e.preventDefault();
        const path = axios.getUri({ url: "/search", params: { query: search } });
        navigate(path)
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/" linkProps={{ to: "/" }}>Store</Breadcrumb.Item>
                <Breadcrumb.Item active>{query}</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={4} md={6} lg={8}>
                    <h1>Searching for: {query}</h1>
                </Col>
                <Col xs={8} md={6} lg={4}>
                    <Form className="d-flex" onSubmit={(e) => handleSearch(e)}>
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            onChange={(e) => setSearch(e.target.value)}
                            defaultValue={search}
                        />
                        <Button variant="outline-success" type="sumbit">Search</Button>
                    </Form>
                </Col>
            </Row>
            <ProductList search={query} />
        </>
    );
}

