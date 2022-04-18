import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Button, Card, CloseButton } from "react-native-elements";
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import baseUrl from "../BaseUrl";
import cartContext from "../Authorization/CartItemProvider";
import { StatusBar } from 'expo-status-bar';
import { Col, Row, Grid } from "react-native-easy-grid";
import authCookieContext from "../Authorization/AuthCookieProvider";

export default function ShoppingCart({ setAmountCart, navigation }) {

    const [products, setProducts] = useState([]);
    const { cartItem, removeAllItemCart, removeItemCart } = useContext(cartContext);
    const { authCookie } = useContext(authCookieContext);

    function refreshCart() {
        if (!cartItem) {
            setProducts([])
            return;
        }
        console.log("cart Item" + cartItem)
        axios({
            url: baseUrl + '/api/products/select',
            method: 'post',
            data: JSON.parse(cartItem)
        })
            .then(function (response) {
                console.log("SETTING STATE!!!")
                setProducts(response.data);
            })
            .catch(function (error) {
                setProducts([])
                console.log(error);
            });
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshCart();
        });
        return unsubscribe;
    }, [navigation, cartItem]);

    function calculateTotal() {
        var sum = 0;
        products.forEach(element => {
            sum += element.price;
        });
        return sum.toFixed(2);
    }

    function buyItems() {
        axios({
            url: baseUrl + '/api/user-products/add-to-account',
            method: 'post',
            data: JSON.parse(cartItem),
            headers: { cookie: authCookie }
        })
            .then(function (response) {
                console.log(response);
                removeAllItemCart()
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function RenderNoItems() {
        return (
            <>
                <Text style={styles.empty}>No items in cart</Text>
            </>
        )
    }

    function handleRemoveAllItemCart() {
        removeAllItemCart();
        setProducts([]);
    }

    function handleRemoveItem(id) {
        removeItemCart(id)
        // TODO: Don't just filter it manually just to update the state again
        var array = JSON.parse(cartItem)
        var filteredArray = array.filter(e => parseInt(e) !== id)
        if (!filteredArray) {
            setProducts([])
            return;
        }
        console.log("cart Item" + filteredArray)
        axios({
            url: baseUrl + '/api/products/select',
            method: 'post',
            data: filteredArray
        })
            .then(function (response) {
                console.log("SETTING STATE!!!")
                setProducts(response.data);
            })
            .catch(function (error) {
                setProducts([])
                console.log(error);
            });
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <StatusBar style="light" />
                {!products.length ? <RenderNoItems /> :
                    <>
                        {products.map((product) => (
                            <TouchableOpacity key={product.id}>
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
                                </Card>
                                <Button title="remove item" onPress={() => handleRemoveItem(product.id)}/>
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.price}>Total: ${calculateTotal()}</Text>
                        {console.log(authCookie)}
                        {authCookie === "AUTH_COOKIE" ? <Text style={styles.title}>Please log in to purchase</Text> : <Button title="buy items" style={{ marginTop: 20 }} onPress={buyItems} />}
                        <Button title="remove all items" style={{ marginTop: 10 }} onPress={() => handleRemoveAllItemCart()} />
                    </>
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
    empty: {
        color: 'rgb(128,128,128)',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "300",
        textAlignVertical: 'center',
    },
});
