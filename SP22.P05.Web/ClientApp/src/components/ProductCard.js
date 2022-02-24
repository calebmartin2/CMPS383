import { Card, Row, Col } from "react-bootstrap";
import './ProductList.css'
export function ProductCard({ myProduct }) {
    return (
        <Col>

        <Card className="ProductCard">
            {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
            <Card.Body>
                <Card.Title>{myProduct.name}</Card.Title>
                <Card.Text>
                    This is a longer card with supporting text below as a natural
                    lead-in to additional content. This content is a little bit longer.
                </Card.Text>
            </Card.Body>
        </Card>
        </Col>

    )
}