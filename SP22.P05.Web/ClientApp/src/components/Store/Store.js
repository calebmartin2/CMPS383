import { useState } from "react";
import { Button, Form, FormControl, Row, Col } from "react-bootstrap";
import { ProductList } from "./ProductList";
import { useNavigate  } from "react-router-dom";
import axios from "axios";

export function Home() {
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const navigate = useNavigate()

  function handleSearch() {
    setSearch2(search);
    const path = axios.getUri({ url: "/search", params: {query: search} });
    navigate(path)
  }
  return (
    <>
      <Row>
        <Col xs={4} md={6} lg={8}>
          <h1>STORE</h1>
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
      <ProductList/>
    </>
  );
}

