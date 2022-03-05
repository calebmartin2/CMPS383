import { ProductList } from "./ProductList";
import { TagList } from "./TagList";
import { Col, Row } from "react-bootstrap";
export function Home() {

  return (
    <>
      <h1>STORE</h1>
      <Row>
        <Col>
          <TagList />
        </Col>
        <Col xs={10}>
          <ProductList />
        </Col>
      </Row>
    </>
  );
}

