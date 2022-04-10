import { Card, Col } from "react-bootstrap";
import './ProductList.css'
import { Link } from "react-router-dom";
import defaultIcon from "../../content/default_ice.png"
export function ProductCard({ myProduct }) {
    function getIconLink() {
        if (!!myProduct.iconName) {
            return `/api/file/icon/${myProduct.id}`
        }
        // If no icon exists, default image
        return defaultIcon
    }
    return (
        <Col>
            <Link to={`/product/${myProduct.id}/${myProduct.name.replace(/ /g, "_")}`} style={{ textDecoration: 'none' }}>
                <Card className="ProductCard h-100" bg="black" text="white" >
                    <Card.Body>
                        <table>
                            <tbody>
                                <tr>
                                    <td rowSpan="2"><Card.Img style={{
                                        height: "5em", width: "5em", marginRight: "1em",
                                    }} variant="left" src={getIconLink()}/></td>
                                    <td><Card.Title style={{ fontWeight: 700 }}>{myProduct.name}</Card.Title></td>
                                </tr>
                                <tr>
                                    <td><Card.Subtitle style={{ color: "#ccc" }}>{myProduct.blurb}</Card.Subtitle></td>
                                </tr>
                            </tbody>
                        </table>
                    </Card.Body>
                    <Card.Footer><Card.Text style={{ float: "left", color: "#999" }}>{myProduct.publisherName}</Card.Text>${myProduct.price.toFixed(2)}</Card.Footer>
                </Card>
            </Link>
        </Col>

    )
}