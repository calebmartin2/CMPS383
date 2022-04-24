import axios from "axios";
import { useState } from "react";
import { Breadcrumb, Button, Col, Form, FormControl, Row } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ProductList } from "./ProductList";
import SortDropdown from "./SortDropdown";

export function Search() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [search, setSearch] = useState(query);
    const order = searchParams.get("sortOrder");
    const [sortOrder, setSortOrder] = useState(order ? order : "most-popular")

    function handleSearch(e) {
        e.preventDefault();
        const path = axios.getUri({ url: "/search/", params: { query: search, sortOrder: sortOrder } });
        navigate(path)
    }

    function handleSelect(e) {
        setSortOrder(e)
        const path = axios.getUri({ url: "/search/", params: { query: search, sortOrder: e } });
        navigate(path)
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/" linkProps={{ to: "/" }}>Store</Breadcrumb.Item>
                <Breadcrumb.Item active>{query}</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={12} md={12} lg={6}>
                    <h1>Searching for: {query}</h1>
                </Col>
                <Col xs={12} md={4} lg={2}>
                    <SortDropdown sortOrder={sortOrder} handleSelect={handleSelect}/>
                </Col>
                <Col xs={12} md={6} lg={4}>
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
            <ProductList search={query} sortOrder={sortOrder} />
        </>
    );
}

