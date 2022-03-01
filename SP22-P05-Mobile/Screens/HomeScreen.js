import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';
import { Text, Card, Button } from 'react-native-elements';

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
        <ScrollView>

        <View style={styles.container}>
            <StatusBar style="auto" />
                

            {products.map((product) => (
                <Card key={product.id}>
                    <Card.Title style={styles.productPrice}>{product.name}</Card.Title>
                    <Text>{product.description}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                </Card>

            ))
            }
        </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    price: {
        fontWeight: "700",
        textAlign: 'right'
    },
    productPrice: {
        textAlign: 'left'
    }
});
