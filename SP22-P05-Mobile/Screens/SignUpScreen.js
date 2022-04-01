import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, Text} from "react-native";
import axios from 'axios';
import baseUrl from '../BaseUrl';

export default function SignUpScreen({navigation}) {
    
    const [userName, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    
    
    function handleSignUp() {

        axios.post(baseUrl + '/api/users/sign-up', {
            userName: userName,
            password: password
        })
            .then(function (response) {
                console.log(response.data);
                navigation.goBack();
            })
            .catch(function (error) {
                console.log(userName);
                console.log(password);
                console.log(error);
            });
        }
    return(
        <>
        <View style={styles.container}>
        <StatusBar style="light" />
        <SafeAreaView>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={userName}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
          />
        </SafeAreaView>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>SIGNUP</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  signUpButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: "black",
    backgroundColor: "white"
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
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
    paddingLeft: 20,
    textAlign: 'left',
    color: 'rgb(255,255,255)'
  },
  scrollView: {
    backgroundColor: 'rgb(19,24,27)',
  },
});
