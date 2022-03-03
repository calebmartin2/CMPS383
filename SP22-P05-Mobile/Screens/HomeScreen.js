import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';
import { Text, Card } from 'react-native-elements';

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
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <StatusBar style="light" />
                {products.map((product) => (
                    <Card key={product.id} containerStyle={{ backgroundColor: 'rgb(33,37,41)', borderColor: 'rgb(9,117,159)' }}>
                        <Card.Title style={styles.title}>{product.name}</Card.Title>
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </Card>
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
        fontWeight: "700",
        textAlign: 'right',
        color: 'rgb(255,255,255)'
    },
    title: {
        textAlign: 'left',
        color: 'rgb(255,255,255)'
    },
    scrollView: {
        backgroundColor: 'rgb(19,24,27)',
    },
});

