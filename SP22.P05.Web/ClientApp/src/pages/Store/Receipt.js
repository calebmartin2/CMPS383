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

    function calculateTotal() {
        var sum = 0;
        products.forEach(element => {
            sum += element.price;
        });
        return sum.toFixed(2);
    }

    return (
        <>
            {handleCartView()}

            <h1>Thank You for Your purchase!</h1>
            <h4>Items bought:</h4>
            {products.map((product) => (
                <div key={product.id}>
                    <div> <img style={{ height: "5em", width: "5em", marginBottom: "1em" }} src={product.iconName} alt="Logo of product" /> {product.name} ${product.price.toFixed(2)}
                        {product.fileName && <Link to={product.fileName} target="_blank" download
                            style={{ backgroundColor: "green", color: "#ddd", padding: "0.2em", marginLeft: "0.5em", textDecoration: "none" }}>Download
                        </Link>}
                    </div>
                </div>
            ))}
            <h4>Total: ${calculateTotal()}</h4>
            <Button onClick={() => { navigate("/", { replace: false }) }}>Continue Shopping</Button><br /><br />
            <Button onClick={() => { navigate("/library", { replace: false }) }}>Go to Library</Button>

        </>
    )
}