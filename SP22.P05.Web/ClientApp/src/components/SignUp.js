import { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";


export function SignUp() {

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSignUpFail, setisSignUpFail] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    function handleSignUp() {
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
                <Alert variant="danger">
                    <Alert.Heading>Need Username and Password.</Alert.Heading>
                </Alert>
            )
        } else if (signUpSuccess) {
            return <Navigate to="/Login"/>
        }
        return <></>
    }

    const handleKeypress = e => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        handleSignUp();
      }
    };

    return (
        <>
            <Form style={{ maxWidth: "20em", margin: "0em auto" }}>
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
                <Button variant="primary" onClick={handleSignUp}>
                    SignUp
                </Button>
            </Form>
            <AlertPassword />
        </>
    )
}

export default SignUp;