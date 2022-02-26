import { Navbar, Container } from "react-bootstrap";
import "./Navmenu.css"

export function Navmenu() {
  return (
    <Navbar expand="lg" variant="dark" bg="black">
      <Container>
        <Navbar.Brand href="/" ><img className="navbar-image" src={require("../content/ice_logo.png")} alt={"ICE Logo"} /></Navbar.Brand>
      </Container>
    </Navbar>
  );
}
