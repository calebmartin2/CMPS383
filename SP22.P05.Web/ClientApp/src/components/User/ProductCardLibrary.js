import { Card, Col } from "react-bootstrap";
import "../Store/ProductList.css"
import { Link } from "react-router-dom";
export function ProductCardLibrary({ myProduct: product }) {
    return (
        <Col>
                <Card className="ProductCard h-100" bg="black" text="white" >
                    <Card.Body>
                        <Card.Title style={{ fontWeight: 700 }}>{product.name}</Card.Title>
                        <Card.Subtitle>{product.blurb}</Card.Subtitle>
                    </Card.Body>
                    <Card.Footer>
                    <Link to={`/api/products/download/${product.id}/${product.fileName}`} target="_blank" download style={{backgroundColor: "green", color: "#ddd", padding: "0.2em", textDecoration: "none"}}>Download</Link>
                    <Card.Text style={{ float: "left", color: "#999" }}>{product.publisherName}</Card.Text>

                    </Card.Footer>
                </Card>
        </Col>

    )
}