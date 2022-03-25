import { Card, Col } from "react-bootstrap";
import './ProductList.css'
import { Link } from "react-router-dom";
export function ProductCard({ myProduct }) {
    return (
        <Col>
        <Link to={`/product/${myProduct.id}/${myProduct.name}`} style={{ textDecoration: 'none' }}>
            <Card className="ProductCard h-100" bg="black" text="white" >
                {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                <Card.Body>
                    <Card.Title style={{ fontWeight: 700 }}>{myProduct.name}</Card.Title>
                </Card.Body>
                <Card.Footer>${myProduct.price.toFixed(2)}</Card.Footer>
            </Card>
            </Link>
        </Col>

    )
}