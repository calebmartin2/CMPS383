import { Link } from "react-router-dom";
import { checkForRole } from "../Auth/checkForRole";
import { Card, Row, Col } from "react-bootstrap";
import { useEffect } from "react";

export function AdminDashboard() {
    const linkStyle = {
        textDecoration: "none",
        color: 'white'
    };

    useEffect(() => {
        document.title = "ICE - Admin Dashboard"
    }, [])

    return (
        <>
            {checkForRole("Admin")}

            <h1>Admin Dashboard</h1>
            <Row xs={1} md={3} className="g-4 text-center">
                <Col>
                    <Card bg='dark' className="h-100 blue-border">
                        <Card.Body as={Link} to="./verify-publishers" style={linkStyle}>
                            Verify Incoming Publishers
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg='dark' className="h-100 blue-border">
                        <Card.Body as={Link} to="./manage-publishers" style={linkStyle}>
                            Manage Publishers
                        </Card.Body>
                    </Card>
                    </Col>
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