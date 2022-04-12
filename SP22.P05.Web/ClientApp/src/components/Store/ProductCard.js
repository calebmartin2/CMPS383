import { Card, Col } from "react-bootstrap";
import './ProductList.css'
import { Link } from "react-router-dom";
import defaultIcon from "../../content/default_ice.png"
export function ProductCard({ myProduct, cart }) {
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
                                    }} variant="left" src={myProduct.iconName ? myProduct.iconName : defaultIcon}/></td>
                                    <td><Card.Title style={{ fontWeight: 700 }}>{myProduct.name}</Card.Title></td>
                                </tr>
                                <tr>
                                    <td><Card.Subtitle style={{ color: "#ccc" }}>{myProduct.blurb}</Card.Subtitle></td>
                                </tr>
                            </tbody>
                        </table>
                    </Card.Body>
                    <Card.Footer>
                        <Card.Text> <span style={{ float: "left", color: "#999" }}> {myProduct.publisherName}</span>
                            {cart.includes(myProduct.id) && <span style={{ backgroundColor: "#0d6efd", paddingLeft: "0.2em", paddingRight: "0.2em" }}>In Cart</span>}&nbsp;
                            {myProduct.isInLibrary && <span style={{ backgroundColor: "green", paddingLeft: "0.2em", paddingRight: "0.2em" }}>In Library</span>}&nbsp;

                            ${myProduct.price.toFixed(2)}
                        </Card.Text>
                    </Card.Footer>
                </Card>
            </Link>
        </Col>

    )
}
