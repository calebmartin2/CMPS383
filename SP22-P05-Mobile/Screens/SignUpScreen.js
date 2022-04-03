import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, Text, Alert, Button } from "react-native";
import axios from 'axios';
import baseUrl from '../BaseUrl';

export default function SignUpScreen({ navigation }) {

  const [userName, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  function handleSignUp() {
    if(password != confirmPassword){
      Alert.alert("Passwords must match.");
      return
    }
    axios.post(baseUrl + '/api/users/sign-up', {
      userName: userName,
      password: password
    })
      .then(function (response) {
        console.log(response.data);
        navigation.goBack();
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Invalid Username or Password.");
      });
  }
  return (
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
           <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
          />
        </SafeAreaView>
        <Button
          title="Terms and Conditions"
          onPress={() => navigation.navigate('TermsAndConditions')}
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>SIGN UP</Text>
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
