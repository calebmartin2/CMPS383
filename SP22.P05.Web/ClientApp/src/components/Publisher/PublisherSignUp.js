import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


export function PublisherSignUp() {
    let navigate = useNavigate();

    const [userName, setUsername] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [show, setShow] = useState(false);


    useEffect(() => {
        document.title = "ICE - Publisher Sign Up"
     }, []);

    const handleSignUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (password !== confirmPassword) {
            setShow(true);
            return;
        }

        axios.post('/api/users/create-publisher', {
            userName: userName,
            password: password,
            companyName: companyName,
            email: email
        })
            .then(function (response) {
                console.log(response.data);
                navigate("/Login", { replace: true });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleKeypress = e => {
        setShow(false);
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
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control required type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={handleKeypress} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$" 
                    title="Minimum 8 characters, at least one number, at least one upper case, at least one lower case, and at least one special character."
                    onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeypress} />
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
            <Alert style={{ maxWidth: "25em", margin: "1em auto" }} show={show} variant="danger">
                <Alert.Heading>Passwords must match.</Alert.Heading>
            </Alert>
        </>
    )
}

export default PublisherSignUp;