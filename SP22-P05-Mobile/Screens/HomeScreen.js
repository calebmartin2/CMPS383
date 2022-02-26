import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';

export default function HomeScreen() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            axios.get(baseUrl + '/api/products')
                .then(function (response) {
                    console.log(response.data);
                    const data = response.data;
                    setProducts(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        fetchProducts();
        console.log(products)
    }, [])

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {products.map((product) => (
                <View key={product.id}>
                    <Text>{product.name}</Text>
                    <Text>{product.description}</Text>
                </View>
            ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
