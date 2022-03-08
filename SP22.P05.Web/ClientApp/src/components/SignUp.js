import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";


export function SignUp() {

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSignUpFail, setisSignUpFail] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [show, setShow] = useState(false);


    useEffect(() => {
        document.title = "ICE - Sign Up"
     }, []);

    function handleSignUp() {
        if (userName === "" || password === "") {
            setisSignUpFail(true);
        }

        if (password !== confirmPassword) {
            setShow(true);
            return;
        }

        axios.post('/api/users/sign-up', {
            userName: userName,
            password: password
        })
            .then(function (response) {
                console.log(response.data);
                setisSignUpFail(false);
                setSignUpSuccess(true);
            })
            .catch(function (error) {
                setisSignUpFail(true)
                console.log(error);
            });
    }

    function AlertPassword() {
        if (isSignUpFail) {
            return (
                <Alert variant="danger" style={{ maxWidth: "25em", margin: "0em auto" }}>
                <Alert.Heading>Need Username and Password.</Alert.Heading>
            </Alert>
            )
        } else if (signUpSuccess) {
            return <Navigate to="/Login" />
        }
        return <></>
    }

    const handleKeypress = e => {
        setShow(false);
        setisSignUpFail(false);
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            handleSignUp();
        }
    };

    return (
        <>
            <Form style={{ maxWidth: "20em", margin: "0em auto" }}>
                <h1>SIGN UP</h1>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Button variant="primary" className="custom-primary-btn" style={{marginBottom: "0.5em"}} onClick={handleSignUp}>
                    SIGN UP
                </Button>
                <Link to="/Login" style={{color: "#84AEC8"}}><br/>
                    Already a Member?
                </Link>
            </Form>
            <AlertPassword />
            <Alert style={{ maxWidth: "25em", margin: "1em auto" }} show={show} variant="danger">
                <Alert.Heading>Passwords must match.</Alert.Heading>
            </Alert>
        </>
    )
}

export default SignUp;
