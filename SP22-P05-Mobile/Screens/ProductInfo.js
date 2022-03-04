import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';


export default function ProductInfo({ route }) {
    const { product } = route.params;
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.publisherName}>Publisher: {product.publisherName}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <View style={styles.tagList}>
                    <Text style={styles.tags}>Tags: </Text>
                    {product.tags.map((tags) => (
                        <Text key={tags} style={styles.tags} >{tags}</Text>
                    ))}
                </View>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(19,24,27)',
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
    }

});