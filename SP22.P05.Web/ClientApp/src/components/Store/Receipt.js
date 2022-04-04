import { Button } from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { handleCartView } from "../Auth/checkForRole";


export default function Receipt() {
    document.title = "ICE - Receipt"

    const { state } = useLocation();
    const navigate = useNavigate();

    if (state === null) {
        return (
            <>
                {handleCartView()}

                <p>Nothing has been bought!</p>
                <Button onClick={() => { navigate("/", { replace: false }) }}>Continue Shopping</Button>
            </>
        )
    }
    const { products } = state;

    return (
        <>
            {handleCartView()}

            <h1>Thank You for Your purchase!</h1>
            <h4>Items bought:</h4>
            {products.map((product) => (
                <div key={product.id}>
                    <p>{product.name} ${product.price.toFixed(2)} 
                    <Link to={`/api/products/download/${product.id}/${product.fileName}`} target="_blank" download style={{backgroundColor: "green", color: "#ddd", padding: "0.2em",marginLeft: "0.5em", textDecoration: "none"}}>Download</Link>
                    </p>
                </div>
            ))}
            <Button onClick={() => { navigate("/", { replace: false }) }}>Continue Shopping</Button><br /><br />
            <Button onClick={() => { navigate("/library", { replace: false }) }}>Go to Library</Button>

        </>
    )
}