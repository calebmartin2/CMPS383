import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {Text} from "react-native";
import authCookieContext from '../Authorization/AuthCookieProvider';

export default function UserLibrary() {
    const [products, setProducts] = useState([]);
    const { authCookie } = useContext(authCookieContext);

    useEffect(() => {
        axios({
            url: '/api/products/library',
            method: 'get',
            headers: { Cookie: authCookie }
        })
            .then(function (response) {
                setProducts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <Text>this is a library</Text>
    )
}