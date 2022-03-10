import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";


export function PublisherSignUp() {

    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignUpFail, setisSignUpFail] = useState(false);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [show, setShow] = useState(false);


    useEffect(() => {
        document.title = "ICE - Publisher Sign Up"
     }, []);

    const handleSignUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (userName === "" || password === "" || companyName === "") {
            setisSignUpFail(true);
        }

        if (password !== confirmPassword) {
            setShow(true);
            return;
        }

        axios.post('/api/users/create-publisher', {
            userName: userName,
            password: password,
            companyName: companyName,
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
            return <Navigate to="/login" />
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
            <Form style={{ maxWidth: "20em", margin: "0em auto" }} onSubmit={handleSignUp}>
                <h1>PUBLISHER <br/>SIGN UP</h1>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCompanyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control required type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control required type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check required type="checkbox" label={<>I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#84AEC8" }}>Terms of Agreement</Link></>}/> 
                </Form.Group>
                <Button variant="primary" type="submit" className="custom-primary-btn">
                    SIGN UP
                </Button>
            </Form>
            <AlertPassword />
            <Alert style={{ maxWidth: "25em", margin: "1em auto" }} show={show} variant="danger">
                <Alert.Heading>Passwords must match.</Alert.Heading>
            </Alert>
        </>
    )
}

export default PublisherSignUp;
