import { useState } from "react";
import { Button, Form, FormControl, Row, Col } from "react-bootstrap";
import { ProductList } from "./ProductList";
import { useNavigate  } from "react-router-dom";
import axios from "axios";

export function Home() {

  const [search, setSearch] = useState("");
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault();
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
      <ProductList/>
    </>
  );
}

