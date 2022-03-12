import { checkForRole } from "../checkForRole";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";


export function PublisherDashboard() {
    const linkStyle = {
        textDecoration: "none",
        color: 'white'
    };
    return (
        <>
            {checkForRole("Publisher")}
            <h1>Publisher Dashboard</h1>
            <Row xs={1} md={3} className="g-4 text-center">
            <Col>
                    <Card bg='dark' className="h-100 blue-border">
                        <Card.Body as={Link} to="./manage-products" style={linkStyle}>
                            Manage Products
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </>
    )
}