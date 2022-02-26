import { Navbar, Container } from "react-bootstrap";
import "./Navmenu.css";
import iceLogo from '../content/ice_logo.png';

export function Navmenu() {
  return (
    <Navbar expand="lg" variant="dark" bg="dark">
      <Container>
        <Navbar.Brand href="/" ><img className="navbar-image" src={iceLogo} alt={"ICE Logo"} /></Navbar.Brand>
      </Container>
    </Navbar>
  );
}
