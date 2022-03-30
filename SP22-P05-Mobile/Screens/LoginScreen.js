import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, Text, Alert, Button } from "react-native";
import axios from 'axios';
import baseUrl from '../BaseUrl';
import authCookieContext from '../Authorization/AuthCookieProvider';
import { withTheme } from 'react-native-elements';


export default function LoginScreen({ navigation }) {
  const [username, onChangeUsername] = useState(null);
  const [password, onChangePassword] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const { authCookie, saveAuthCookie } = useContext(authCookieContext);

  async function getMeTest() {
    axios({
      method: 'get',
      url: baseUrl + '/api/authentication/me',
      headers: { Cookie: authCookie }
    })
      .then(function (response) {
        setIsLoggedIn(true);
        setUserName(response.data.userName);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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
        setIsLoggedIn(true);
        var cookie = response.headers["set-cookie"][0].split(";")[0];
        async function temp() {
          setUserName(response.data.userName);
          await saveAuthCookie(cookie);
          navigation.navigate('Root', { screen: 'Store' })
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
        saveAuthCookie("AUTH-COOKIE")
        setUserName("")
        onChangeUsername("")
        onChangePassword("")
        setIsLoggedIn(false)
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  useEffect(() => {
    getMeTest()
  }, [])

  return (
    <>
      {!isLoggedIn ? <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.title}>Login</Text>
        <SafeAreaView>
          <TextInput
            style={styles.input}
            onChangeText={onChangeUsername}
            autoCorrect={false}
            autoCapitalize="none"
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
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
        :
        <View  style={styles.container}>
          <Text style={styles.username}>Hello, {userName}!</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
            <Text style={styles.loginText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>}
    </>
  );
}

const styles = StyleSheet.create({
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
  username: {
    fontSize: 20,
    paddingLeft: 20,
    fontWeight: "bold",
    margin: 15,
    textAlign: 'left',
    color: 'rgb(255,255,255)'
  },
  scrollView: {
    backgroundColor: 'rgb(19,24,27)',
  },
});
