import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView, RefreshControl, Image } from 'react-native';
import axios from "axios";
import baseUrl from '../BaseUrl';
import { Text, Card, SearchBar } from 'react-native-elements';
import { Col, Row, Grid } from "react-native-easy-grid";
import authCookieContext from '../Authorization/AuthCookieProvider';

export default function UserLibrary() {
    const [products, setProducts] = useState([]);
    const { authCookie } = useContext(authCookieContext);
    const [refreshing, setRefreshing] = React.useState(false);
    const [search, setSearch] = useState("");

    const updateSearch = (search) => {
        setSearch(search);
    }

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchLibrary();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    async function fetchLibrary() {
        axios({
            url: baseUrl + '/api/products/library',
            method: 'get',
            headers: { Cookie: authCookie },
            params: { query: search },
        })
            .then(function (response) {
                setProducts(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchLibrary();
    }, [search])


    return (
        <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.container}>
                <StatusBar style="light" />
                <SearchBar
                    placeholder="Search"
                    onChangeText={updateSearch}
                    value={search}
                />
                {!products.length && <Text style={styles.empty}>no products in library</Text>}
                {products.map((product) => (
                    <Card key={product.id} containerStyle={{ backgroundColor: 'rgb(33,37,41)', borderColor: 'rgb(9,117,159)' }} >
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
                            </View>
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
    price: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: 'right',
        color: 'rgb(255,255,255)'
    }
});