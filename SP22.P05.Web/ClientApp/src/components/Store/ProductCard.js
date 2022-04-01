import { Card, Col } from "react-bootstrap";
import './ProductList.css'
import { Link } from "react-router-dom";
export function ProductCard({ myProduct }) {
    return (
        <Col>
            <Link to={`/product/${myProduct.id}/${myProduct.name.replace(/ /g,"_")}`} style={{ textDecoration: 'none' }}>
                <Card className="ProductCard h-100" bg="black" text="white" >
                    <Card.Body>
                        <table>
                            <tr>
                                <td rowspan="2"><Card.Img style={{
                                    height: "5em", width: "5em", marginRight: "1em",
                                }} variant="left" src="https://www.pinclipart.com/picdir/middle/193-1931067_pixel-clipart-finn-50-x-50-px-png.png" /></td>
                                <td><Card.Title style={{ fontWeight: 700 }}>{myProduct.name}</Card.Title></td>
                            </tr>
                            <tr>
                                <td><Card.Subtitle style={{ color: "#ccc" }}>{myProduct.blurb}</Card.Subtitle></td>
                            </tr>
                        </table>



                    </Card.Body>
                    <Card.Footer><Card.Text style={{ float: "left", color: "#999" }}>{myProduct.publisherName}</Card.Text>${myProduct.price.toFixed(2)}</Card.Footer>
                </Card>
            </Link>
        </Col>

    )
}