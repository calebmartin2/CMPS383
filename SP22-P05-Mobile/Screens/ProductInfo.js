import { Text } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

export default function ProductInfo({ route }) {
    const { product } = route.params;
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.text}>{product.name}</Text>
                <Text style={styles.text}>{product.description}</Text>
                <Text style={styles.text}>${product.price.toFixed(2)}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgb(19,24,27)'
    },

    text: {
        color: 'rgb(255,255,255)'
    }

});