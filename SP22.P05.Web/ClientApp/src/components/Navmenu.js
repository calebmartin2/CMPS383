import { Navbar, Container } from "react-bootstrap";
import "./Navmenu.css";
import iceLogo from '../content/ice_logo.png';
import {Button} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export function Navmenu() {
  let location = useLocation()
  return (
    <>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container>
          <Navbar.Brand href="/" ><img className="navbar-image" src={iceLogo} alt={"ICE Logo"} /></Navbar.Brand>
          {location.pathname.toLowerCase() === '/login' ? null : <Link to = "/Login"><Button variant="primary"> LOGIN</Button></Link> }
        </Container>
      </Navbar>
    </>
  );
}

