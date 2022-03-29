import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, Text, Alert, Button} from "react-native";
import axios from 'axios';
import baseUrl from '../BaseUrl';
import authCookieContext from '../Authorization/AuthCookieProvider';


export default function LoginScreen({navigation}) {
  const [username, onChangeUsername] = useState(null);
  const [password, onChangePassword] = useState(null);
  const {authCookie, saveAuthCookie } = useContext(authCookieContext);

  function handleLogin() {
    axios.post(baseUrl + '/api/authentication/login', {
      username: username,
      password: password
    })
      .then(function (response) {
        // console.log(response.data);
        // console.log("headers:", response.headers);

        // if (response?.headers?.get("set-cookie")) {
        //   const cookie = response.headers.get("set-cookie").spit(";")[0];
        //   console.log(cookie);
        //   saveAuthCookie(response.headers.get("set-cookie").split(";")[0]);
        // }
        var cookie = response.headers["set-cookie"][0].split(";")[0];
        async function temp(){
          await saveAuthCookie(cookie);
          navigation.navigate('ICE - Store')
        }
        temp();
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Invalid Username or Password.");

      });
      
  };

  function handleLogout() {
    axios({
      method: 'post',
      url: baseUrl + '/api/authentication/logout',
      headers: { Cookie: authCookie }
  })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
          console.log(error);
      });
      
  };

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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
          <Text style={styles.loginText}>LOGOUT</Text>
        </TouchableOpacity>
        <Button
          title="Sign Up Here"
          onPress={()=> navigation.navigate('SignUp')}
        />
        <Button
          title="Store"
          onPress={()=> navigation.navigate('ICE - Store')}
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
