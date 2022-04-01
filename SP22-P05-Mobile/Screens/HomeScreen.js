import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';
import { Text, Card } from 'react-native-elements';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
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
    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.container}>
                <StatusBar style="light" />
                {products.map((product) => (
                    <TouchableOpacity key={product.id} onPress={() => navigation.navigate('ProductInfo', { product: product })}>
                        <Card containerStyle={{ backgroundColor: 'rgb(33,37,41)', borderColor: 'rgb(9,117,159)' }} >
                            <Card.Title style={styles.title}>{product.name}</Card.Title>
                            <Text style={styles.blurb}>{product.blurb}</Text>

                            <View style={styles.container2}>
                            <Text style={styles.price}>{product.publisherName}</Text>
                               <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                            </View>
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
    blurb: {
        color: 'rgb(255,255,255)',
        marginBottom: 15
    },
    scrollView: {
        backgroundColor: 'rgb(19,24,27)',
    },
    description: {
        color: 'rgb(255,255,255)'
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
});

