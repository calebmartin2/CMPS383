import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {Text, Card} from "react-native";
import baseUrl from '../BaseUrl';
import { Col, Row, Grid } from "react-native-easy-grid";
import authCookieContext from '../Authorization/AuthCookieProvider';

export default function UserLibrary() {
    const [products, setProducts] = useState([]);
    const { authCookie } = useContext(authCookieContext);

    useEffect(() => {
        axios({
            url: baseUrl + '/api/products/library',
            method: 'get',
            headers: { Cookie: authCookie }
        })
            .then(function (response) {
                setProducts(response.data);
                console.log(products)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <Text>this is a library</Text>
    )
}