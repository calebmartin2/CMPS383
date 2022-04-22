import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { useContext } from "react";
import { Button, Text } from 'react-native-elements';
import cartContext from "../Authorization/CartItemProvider"
import baseUrl from '../BaseUrl';

export default function ProductInfo({ route }) {
    const { product } = route.params;
    const { cartItem, appendCartItem } = useContext(cartContext);

    function handleAddCart(id) {
        appendCartItem(JSON.stringify(id));
    }

    function renderAddCartButton() {
        if (cartItem && cartItem.includes(product.id))
            return <Button title="In Cart" />
        if (product.isInLibrary)
            return <Button title="In Library" />
        return <Button title="Add to cart" onPress={() => handleAddCart(product.id)} />
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.publisherName}>Publisher: {product.publisherName}</Text>
                {product.pictures && product.pictures.map((picture) =>
                    <View key={picture} style={styles.imgContainer}>
                        <Image style={styles.image} source={{ uri: baseUrl + picture }} />
                    </View>
                )}
                <Text style={styles.description}>{product.description}</Text>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                {renderAddCartButton()}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(19,24,27)',
    },
    imgContainer: {
        flexDirection: 'row'
    },
    image: {
        resizeMode: 'contain',
        flex: 1,
        aspectRatio: 1.77 // Your aspect ratio
    },
    name: {
        fontSize: 50,
        fontWeight: "700",
        textAlign: 'left',
        color: 'rgb(255,255,255)',
        paddingLeft: 10,
        paddingBottom: 10,
        paddingTop: 10
    },

    publisherName: {
        fontSize: 20,
        fontWeight: "700",
        paddingLeft: 10,
        paddingBottom: 5,
        color: 'rgb(255,255,255)'
    },

    description: {
        fontSize: 20,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 15,
        color: 'rgb(255,255,255)'
    },

    tags: {
        fontSize: 20,
        paddingLeft: 5,
        color: 'rgb(255,255,255)',
    },

    tagList: {
        flexDirection: 'row',
    },

    price: {
        fontSize: 25,
        fontWeight: "700",
        paddingRight: 20,
        paddingBottom: 5,
        color: 'rgb(255,255,255)',
        textAlign: 'right'
    },
    scrollView: {
        backgroundColor: 'rgb(19,24,27)',
    },

});