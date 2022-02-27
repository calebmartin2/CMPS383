import { Navbar, Container } from "react-bootstrap";
import "./Navmenu.css";
import iceLogo from '../content/ice_logo.png';
import { Button } from "react-bootstrap";
import { Link, Navigate, useLocation } from "react-router-dom";

export function Navmenu() {
  let location = useLocation()
  const loggedInUser = localStorage.getItem("user");

  function renderLoginButton() {
    if (loggedInUser && location.pathname.toLowerCase() === '/login') {
      return <Navigate to="/" />
    } else if (loggedInUser) {
      return JSON.parse(loggedInUser).userName
    } else if (location.pathname.toLowerCase() !== '/login') {
      return <Link to="/Login"><Button variant="primary"> LOGIN</Button></Link>
    }
  }

  return (
    <>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container>
          <Navbar.Brand href="/" ><img className="navbar-image" src={iceLogo} alt={"ICE Logo"} /></Navbar.Brand>
          {renderLoginButton()}
        </Container>
      </Navbar>
    </>
  );
}

