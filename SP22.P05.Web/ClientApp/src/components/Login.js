import { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";


export function Login() {

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoginFail, setisLoginFail] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);

    function handleLogin() {
        axios.post('/api/authentication/login', {
            userName: userName,
            password: password
        })
            .then(function (response) {
                console.log(response.data);
                setisLoginFail(false);
                setLoginSuccess(true);
                localStorage.setItem('user', JSON.stringify(response.data))
            })
            .catch(function (error) {
                setisLoginFail(true)
                console.log(error);
            });
    }

    function AlertPassword() {
        if (isLoginFail) {
            return (
                <Alert variant="danger">
                    <Alert.Heading>Invalid Username or Password.</Alert.Heading>
                </Alert>
            )
        } else if (loginSuccess) {
            return <Navigate to="/"/>
        }
        return <></>
    }

    const handleKeypress = e => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        handleLogin();
      }
    };

    return (
        <>
            <Form style={{ maxWidth: "20em", margin: "0em auto" }}>
            <h1>LOGIN</h1>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Link to="/">
                    <Button variant="secondary">
                        BACK
                    </Button>
                </Link>
                <Button variant="primary" onClick={handleLogin}>
                    LOGIN
                </Button>
            </Form>
            <AlertPassword />
        </>
    )
}

export default Login;