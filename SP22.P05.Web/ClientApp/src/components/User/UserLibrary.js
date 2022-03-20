import { useEffect, useState } from "react";
import axios from "axios";
export default function UserLibrary() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios({
            url: '/api/products/library',
            method: 'get',
        })
            .then(function (response) {
                setProducts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, []);

    return (
        <>
            <h1>LIBRARY</h1>
            <div>
                {products.map((product) => (
                    <p key={product.id}>{product.name} {product.price.toFixed(2)}</p>
                ))
                }
            </div>
        </>
    )
}





