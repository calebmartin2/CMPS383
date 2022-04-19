import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';
import { Text, Card } from 'react-native-elements';
import { Col, Row, Grid } from "react-native-easy-grid";
import cartContext from '../Authorization/CartItemProvider';


export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const { cartItem } = useContext(cartContext);

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
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProducts();
            return unsubscribe;
        });
    }, [])

    return (
        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.container}>
                <StatusBar style="light" />
                {products.map((product) => (
                    <TouchableOpacity key={product.id} onPress={() => navigation.navigate('ProductInfo', { product: product })}>
                        <Card containerStyle={{ backgroundColor: 'rgb(33,37,41)', borderColor: 'rgb(9,117,159)' }} >
                            <Grid>
                                <Col style={{ width: 120 }}>
                                    <Image style={{
                                        width: 100,
                                        height: 100,
                                    }} source={{ uri: baseUrl + product.iconName }} />
                                </Col>
                                <Col>
                                    <Row>
                                        <Card.Title style={styles.title}>{product.name} </Card.Title>
                                    </Row>
                                    <Row>
                                        <Text style={styles.blurb}>{product.blurb}</Text>
                                    </Row>
                                </Col>
                            </Grid>
                            <View style={styles.container2}>
                                <Text style={styles.price}>{product.publisherName}</Text>
                                
                                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                            </View>
                            <View>
                            {product.isInLibrary && <Text style={styles.inLibrary}>IN LIBRARY</Text>}
                                {cartItem && cartItem.includes(product.id) && <Text style={styles.inCart}>IN CART</Text>}
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
    inLibrary: {
        color: "#00ff26",
        fontSize: 18,
        fontWeight: "300",
        backgroundColor: "#0a4d00",
        padding: 5,
        marginTop: 5,
        alignSelf: 'flex-end'
    },
    inCart: {
        color: "#00e5ff",
        backgroundColor: "#003f63",
        fontSize: 18,
        fontWeight: "300",
        padding: 5,
        marginTop: 5,
        alignSelf: 'flex-end'
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
    empty: {
        color: 'rgb(128,128,128)',
        fontSize: 18,
        fontWeight: "300",
    }
});

