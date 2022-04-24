import axios from "axios";
import { useState } from "react";
import { Button, Col, Form, FormControl, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProductList } from "./ProductList";
import SortDropdown from "./SortDropdown";

export function Home() {

  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const order = searchParams.get("sortOrder");
  const [sortOrder, setSortOrder] = useState(order ? order : "most-popular");

  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault();
    const path = axios.getUri({ url: "/search/", params: { query: search } });
    navigate(path)
  }
  
  function handleSelect(e) {
    const path = axios.getUri({ url: "/", params: { sortOrder: e } });
    navigate(path)
    setSortOrder(e)
  }

  return (
    <>
      <Row>
        <Col xs={4} md={2} lg={6}>
          <h1>STORE</h1>
        </Col>
        <Col xs={8} md={4} lg={2}>
          <SortDropdown sortOrder={sortOrder} handleSelect={handleSelect} />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form className="d-flex" onSubmit={(e) => handleSearch(e)}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              onChange={(e) => setSearch(e.target.value)}
              required
            />
            <Button variant="outline-success" type="submit" >Search</Button>
          </Form>
        </Col>
      </Row>
      <ProductList sortOrder={sortOrder} />
    </>
  );
}

