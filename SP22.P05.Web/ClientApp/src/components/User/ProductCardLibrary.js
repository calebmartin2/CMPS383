import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import defaultIcon from "../../content/default_ice.png";
import "../Store/ProductList.css";

export function ProductCardLibrary({ myProduct: product }) {
    return (
        <Col>
            <Card className="ProductCard h-100" bg="black" text="white" >
                <Card.Body>
                    <table>
                        <tbody>
                            <tr>
                                <td rowSpan="2"><Card.Img style={{
                                    height: "5em", width: "5em", marginRight: "1em",
                                }} variant="left" src={product.iconName ? product.iconName : defaultIcon} /></td>
                                <td><Card.Title style={{ fontWeight: 700 }}>{product.name}</Card.Title></td>
                            </tr>
                            <tr>
                                <td><Card.Subtitle>{product.blurb}</Card.Subtitle></td>
                            </tr>
                        </tbody>
                    </table>
                </Card.Body>
                <Card.Footer>
                    <Link to={product.fileName ? product.fileName : ""} target="_blank" download style={{ backgroundColor: "green", color: "#ddd", padding: "0.2em", textDecoration: "none" }}>Download</Link>
                    <Card.Text style={{ float: "left", color: "#999" }}>{product.publisherName}</Card.Text>
                </Card.Footer>
            </Card>
        </Col>

    )
}