import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, CloseButton } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Text, ScrollView} from "react-native";
import baseUrl from "../BaseUrl";
import { StatusBar } from "expo-status-bar";

export default function ShoppingCart({ setAmountCart, navigation }) {
    const cart = AsyncStorage.getItem('cart');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        var tempCart = cart;
        axios({
            url: baseUrl + '/api/products/select',
            method: 'post',
            data: tempCart
        })
            .then(function (response) {
                setProducts(response.data);
                
            })
            .catch(function (error) {
                console.log(error);
                
            });

    }, [cart]); 

    function removeItemCart(id) {
        var allCart = AsyncStorage.getItem("cart");
        if (allCart == null) {
            return;
        }
        
        allCart = allCart.filter(item => item !== id.toString());
        AsyncStorage.setItem("cart", JSON.stringify(allCart));
        setAmountCart(allCart.length);

    }

    function removeAllItemCart() {
        AsyncStorage.removeItem("cart")
        setAmountCart(0);
        setProducts([]);

    }
    function calculateTotal() {
        var sum = 0;
        products.forEach(element => {
            sum += element.price;
        });
        return sum.toFixed(2);
    }

    function buyItems() {
        var tempCart = cart;

        axios({
            url: baseUrl + '/api/user-products/add-to-account',
            method: 'post',
            data: tempCart
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
                <Text>No items in cart</Text>
                <Button onPress={() => { navigation.navigate("/", { replace: false }) }}>Continue Shopping</Button>
            </>
        )
    }
    return (
        <ScrollView>
            {products.map((product) =>(
            <View style = {style.container}>
                <StatusBar style = "light"/>
                {!products.length && <Text style = {styles.empty}>no products in library</Text>}
                <View key = {products.id}>
                    <Card style={{ margin: "1em" }} className="blue-border" bg="black" text="white">
                        <Card.body>
                            {product.id}
                        </Card.body>
                    </Card>
                </View>
            </View>
            ))
            }
        </ScrollView>
    );
}