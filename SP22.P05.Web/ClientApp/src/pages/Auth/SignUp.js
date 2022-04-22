import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


export function SignUp() {
    let navigate = useNavigate();

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [show, setShow] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [success] = useState(true);

    useEffect(() => {
        document.title = "ICE - Sign Up"
        if (!password || !userName) {
            return;
        }
        setShow(false);
    }, [password, userName, confirmPassword]);

    const handleSignUp = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        if (password !== confirmPassword) {
            setShow(true);
            setLoading(false);
            return;
        }

        axios.post('/api/users/sign-up', {
            userName: userName,
            password: password
        })
            .then(function (response) {
                setLoading(false);
                navigate("/Login", {state: {success: success } });
            })
            .catch(function (error) {
                setLoading(false);
            });
    }

    return (
        <>
            <Form style={{ maxWidth: "20em", margin: "0em auto" }} onSubmit={handleSignUp}>
                <h1>SIGN UP</h1>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$"
                        title="Minimum 8 characters, at least one number, at least one upper case, at least one lower case, and at least one special character."
                        onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control required type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value) }  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check required type="checkbox" label={<>I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#84AEC8" }}>Terms and Conditions</Link></>} />
                </Form.Group>
                <Button type="submit" variant="primary" className="custom-primary-btn" style={{ marginBottom: "0.5em" }} disabled={isLoading}>
                {isLoading ? <><Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    /> SIGNING UP </> : 'SIGN UP'}
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
