import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
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

            <p>Thank You for Your purchase!</p>
            {products.map((product) => (
                <div key={product.id}>
                    <p>{product.name} ${product.price.toFixed(2)}</p>
                </div>
            ))}
            <Button onClick={() => { navigate("/", { replace: false }) }}>Continue Shopping</Button><br /><br />
            <Button onClick={() => { navigate("/library", { replace: false }) }}>Go to Library</Button>

        </>
    )
}