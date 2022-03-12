import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


export function SignUp() {
    let navigate = useNavigate();

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [show, setShow] = useState(false);


    useEffect(() => {
        document.title = "ICE - Sign Up"
    }, []);

    const handleSignUp = (event) => {
        event.preventDefault();
        event.stopPropagation();

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
                navigate("/Login", { replace: true });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const handleKeypress = (e) => {
        setShow(false);
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            handleSignUp();
        }
    };

    return (
        <>
            <Form style={{ maxWidth: "20em", margin: "0em auto" }} onSubmit={handleSignUp}>
                <h1>SIGN UP</h1>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeypress} />
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
                {/* <Button variant="primary" className="custom-primary-btn" style={{marginBottom: "0.5em"}} onClick={handleSignUp}>
                    SIGN UP
                </Button> */}
                <Button type="submit" variant="primary" className="custom-primary-btn" style={{ marginBottom: "0.5em" }}>
                    SIGN UP
                </Button>
                <Link to="/Login" style={{ color: "#84AEC8" }}><br />
                    Already a Member?
                </Link>
                <Link to="/publisher/signup" style={{ color: "#84AEC8" }}><br />
                    Publisher Sign Up
                </Link>
            </Form>
            <Alert style={{ maxWidth: "25em", margin: "1em auto" }} show={show} variant="danger">
                <Alert.Heading>Passwords must match.</Alert.Heading>
            </Alert>
        </>
    )
}

export default SignUp;
