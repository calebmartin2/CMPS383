import { Navbar, Container } from "react-bootstrap";
import "./Navmenu.css";
import iceLogo from '../content/ice_logo.png';
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";

export function Navmenu() {

  const [show, setShow] = useState(false);
  const [userName, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  function handleLogin() {
    axios.post('/api/authentication/login', {
      userName: userName,
      password: password
    })
      .then(function (response) {
        console.log(response.data);
        handleClose()
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container>
          <Navbar.Brand href="/" ><img className="navbar-image" src={iceLogo} alt={"ICE Logo"} /></Navbar.Brand>
          <Button variant="primary" onClick={handleShow}>LOGIN</Button>
        </Container>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>LOGIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" value={userName} onChange={(e) => setUsername(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            LOGIN
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

