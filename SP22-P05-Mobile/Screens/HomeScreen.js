import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';
import { Text, Card, SearchBar } from 'react-native-elements';
import { Col, Row, Grid } from "react-native-easy-grid";
import cartContext from '../Authorization/CartItemProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false)
    const [search, setSearch] = useState("");
    const { cartItem } = useContext(cartContext);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchProducts();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const updateSearch = (search) => {
        setSearch(search);
        AsyncStorage.setItem('search', search);
    }

    async function fetchProducts() {
        console.log("FETCH: " + search)
        const delayDebounceFn = setTimeout(() => {
            axios({
                url: baseUrl + '/api/products/',
                params: { query: search },
                method: 'get',
            })
                .then(function (response) {
                    setProducts(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }, 100)
        return () => {
            clearTimeout(delayDebounceFn);
        }
    }

    useEffect(() => {
        fetchProducts(search)
    }, [search])

    useEffect(() => {
        console.log("UE")
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('search').then((value) => {
                console.log("S " + search);
                console.log("V " + value);
                if (value !== null) {
                    console.log("setting search")
                    setSearch(value)
                } else {
                    fetchProducts();
                }
                return unsubscribe;
            });
        })
    }, [])

    return (
        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <SearchBar
                    placeholder="Search"
                    onChangeText={updateSearch}
                    value={search}
                />
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

