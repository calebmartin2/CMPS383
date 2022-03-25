import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';
import { Text, Card } from 'react-native-elements';
import authCookieContext from '../Authorization/AuthCookieProvider';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [userName, setUserName] = useState("No name");
    const [refreshing, setRefreshing] = React.useState(false);
    const { authCookie } = useContext(authCookieContext);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getMeTest();
        fetchProducts();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    async function fetchProducts() {
        axios.get(baseUrl + '/api/products')
            .then(function (response) {
                const data = response.data;
                setProducts(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function getMeTest() {
        axios({
            method: 'get',
            url: baseUrl + '/api/authentication/me',
            headers: { 'set-cookie': JSON.parse(authCookie) }
        })
            .then(function (response) {
                setUserName(response.data.userName);
            })
            .catch(function (error) {
                console.log("NO SUCCESS");
            });
    }
    useEffect(() => {
        getMeTest()
        fetchProducts();
        console.log(products)
    }, [])

    return (
        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <Text style={styles.title} >{userName}</Text>
                {products.map((product) => (
                    <TouchableOpacity key={product.id} onPress={() => navigation.navigate('ProductInfo', { product: product })}>
                        <Card containerStyle={{ backgroundColor: 'rgb(33,37,41)', borderColor: 'rgb(9,117,159)' }} >
                            <Card.Title style={styles.title}>{product.name}</Card.Title>
                            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                        </Card>
                    </TouchableOpacity>
                ))
                }
            </View>
        </ScrollView >
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(19,24,27)',

    },
    price: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: 'right',
        color: 'rgb(255,255,255)'
    },
    title: {
        fontSize: 20,
        textAlign: 'left',
        color: 'rgb(255,255,255)'
    },
    scrollView: {
        backgroundColor: 'rgb(19,24,27)',
    },
});

