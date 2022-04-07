import axios from "axios";
import { useEffect, useState } from "react";
import {Text} from "react-native";

export default function UserLibrary() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        axios({
            signal: controller.signal,
            url: '/api/products/library',
            params: { query: search },
            method: 'get',
        })
            .then(function (response) {
                setLoading(false);
                setProducts(response.data);

            })
            .catch(function (error) {
                setLoading(false);
                console.log(error);
            });
        return () => {
            controller.abort();
        }
    }, [search]);

    return (
        <Text>this is a library</Text>
    )
}