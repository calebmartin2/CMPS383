import { useState } from "react";
import { Button, Form, FormControl, Row, Col } from "react-bootstrap";
import { ProductList } from "./ProductList";
export function Home() {
  const [search, setSearch] = useState("");
  
  function handleSearch() {

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
      <ProductList />
    </>
  );
}

