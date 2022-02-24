import { Navbar, Container  } from "react-bootstrap";

export function Navmenu() {
    return (
    <Navbar expand="lg" variant="light" bg="light">
        <Container>
          <Navbar.Brand href="/">ICE</Navbar.Brand>
        </Container>
    </Navbar>
    );
}
