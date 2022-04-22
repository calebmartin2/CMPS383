import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Login({ setAmountCart }) {

    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoginFail, setisLoginFail] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { state } = useLocation();
    let navigate = useNavigate();
    const { success } = state || {};

    // Hide error on form change
    useEffect(() => {
        document.title = "ICE - Login"
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
                setisLoginFail(false);
                localStorage.setItem('user', JSON.stringify(response.data));
                setLoading(false);
                if (response.data.roles.includes('User')) {
                    intializeCart(response, setAmountCart, navigate);
                } else {
                    localStorage.removeItem('cart');
                    navigate("/");
                }
            })
            .catch(function (error) {
                setisLoginFail(true)
                setLoading(false);

            });
    }

    return (
        <>
            <Form style={{ maxWidth: "20em", margin: "0em auto" }} onSubmit={handleLogin}>
                {success && <h2 style={{ backgroundColor: "green", padding: "0.2em" }}>Account created!</h2>}
                <h1>LOGIN</h1>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button type="submit" variant="primary" className="custom-primary-btn" style={{ marginBottom: "0.5em" }} disabled={isLoading}>
                    {isLoading ? <><Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    /> LOGGING IN</> : 'LOGIN'}
                </Button>
                <Link to="/SignUp" style={{ color: "#84AEC8" }}><br />
                    New to ICE?
                </Link>
            </Form>
            {isLoginFail && 
            <Alert variant="danger" style={{ maxWidth: "25em", margin: "0em auto" }}>
                <Alert.Heading>Invalid Username or Password.</Alert.Heading>
            </Alert>}
        </>
    )
}

export default Login;

function intializeCart(response, setAmountCart, navigate) {
    //https://stackoverflow.com/questions/65084192/how-can-i-wait-until-the-functions-finish-in-reactjs
    var totalCart = [];
    axios.get('/api/user-products/get-cart')
        .then(function (response) {
            totalCart = response.data.concat(JSON.parse(localStorage.getItem('cart')));
            //https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
            var filtered = totalCart.filter(function (el) {
                return el != null;
            });
            filtered = filtered.map(String);
            filtered = [...new Set(filtered)];
            axios({
                url: '/api/user-products/sync-cart',
                method: 'post',
                data: filtered
            })
                .then(function (response) {
                    localStorage.setItem("cart", JSON.stringify(response.data.map(String)));
                    setAmountCart(response.data.length);
                    navigate("/")
                })
                .catch(function (error) {
                });
        }).catch(function (error) {
        });
}

