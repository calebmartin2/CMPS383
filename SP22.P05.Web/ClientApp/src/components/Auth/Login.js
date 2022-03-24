import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import getCart from "../User/getCart";

export function Login() {

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoginFail, setisLoginFail] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [isLoading, setLoading] = useState(false);


    useEffect(() => {
        document.title = "ICE - Login"
    }, []);
    useEffect(() => {
        if (!password || !userName) {
            return;
        }
        setisLoginFail(false);
    }, [password, userName]);
    

    const handleLogin = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        axios.post('/api/authentication/login', {
            userName: userName,
            password: password
        })
            .then(function (response) {
                console.log(response.data);
                // Only if the user is not admin/publisher
                if (response.data.roles.includes('User')) {
                    getCart();
                }
                setisLoginFail(false);
                setLoginSuccess(true);
                localStorage.setItem('user', JSON.stringify(response.data));
                // console.log(!response.data.roles.includes('User'));
                setLoading(false);

            })
            .catch(function (error) {
                setisLoginFail(true)
                console.log(error);
                setLoading(false);

            });
            
    }

    function AlertPassword() {
        if (isLoginFail) {
            return (
                <Alert variant="danger" style={{ maxWidth: "25em", margin: "0em auto" }}>
                    <Alert.Heading>Invalid Username or Password.</Alert.Heading>
                </Alert>
            )
        } else if (loginSuccess) {
            return <Navigate to="/" />
        }
        return <></>
    }

    return (
        <>
            <Form style={{ maxWidth: "20em", margin: "0em auto" }} onSubmit={handleLogin}>
                <h1>LOGIN</h1>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit" variant="primary" className="custom-primary-btn" style={{ marginBottom: "0.5em" }} disabled={isLoading}>LOGIN
                </Button>
                <Link to="/SignUp" style={{ color: "#84AEC8" }}><br />
                    New to ICE?
                </Link>
            </Form>
            <AlertPassword />
        </>
    )
}

export default Login;