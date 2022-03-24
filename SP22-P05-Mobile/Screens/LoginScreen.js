import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, Text, Alert, Button, props} from "react-native";
import axios from 'axios';
import baseUrl from '../BaseUrl';


export default function LoginScreen({navigation}) {
  const [username, onChangeUsername] = useState(null);
  const [password, onChangePassword] = useState(null);

  function handleLogin() {
    axios.post(baseUrl + '/api/authentication/login', {
      username: username,
      password: password
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Invalid Username or Password.");
      });
  }

  return (
    <>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <SafeAreaView>
          <TextInput
            style={styles.input}
            onChangeText={onChangeUsername}
            value={username}
            placeholder="Username"
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
          />
        </SafeAreaView>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <Button
          title="Sign Up Here"
          onPress={()=> navigation.navigate('SignUp')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});
