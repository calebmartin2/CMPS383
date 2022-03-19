import { Navbar, Container, Nav, NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Navmenu.css";
import iceLogo from '../content/ice_logo.png';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { checkForRole } from "./checkForRole";

export function Navmenu() {
  let location = useLocation()
  const loggedInUser = localStorage.getItem("user");
  let navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    axios.post('/api/authentication/logout', {
    })
      .then(function (response) {
        console.log(response.data);
        navigate("/", { replace: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function renderLoginButton() {
    if (loggedInUser && location.pathname.toLowerCase() === '/login') {
      return <Navigate to="/" />
    } else if (loggedInUser) {
      return (
        <>
        {!checkForRole("User") ? <Nav.Link as={Link} to="/cart">CART</Nav.Link> : null}
       

          <NavDropdown title={JSON.parse(loggedInUser).userName.toUpperCase()} id="navbarScrollingDropdown">
            <NavDropdown.Item to="/" onClick={handleLogout}>LOGOUT</NavDropdown.Item>
          </NavDropdown>
        </>
      )
    }
    return (
      <>
       <Nav.Link as={Link} to="/cart">CART</Nav.Link>
        <Nav.Link as={Link} to="/Login">LOGIN</Nav.Link>
        <Nav.Link as={Link} to="/SignUp">SIGN UP</Nav.Link>
      </>
    )
  }

  return (
    <>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" ><img className="navbar-image" src={iceLogo} alt={"ICE Logo"} /></Navbar.Brand>
          <Nav className="me-auto">
          {checkForRole("Publisher") ? null : <Nav.Link as={Link} to="/publisher">PUBLISHER</Nav.Link>}
          {checkForRole("Admin") ? null : <Nav.Link as={Link} to="/admin">ADMIN</Nav.Link>}
          </Nav>
          <Nav>
            {checkForRole("PendingPublisher") ?
              null :
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="publisherPending">Your request to publish software has been submitted. You will soon get an email from 383@envoc.com.</Tooltip>}>
                <Nav.Item style={{ backgroundColor: "#5c3a00", color: "#ffb029", padding: "0.5em", paddingLeft: "0.5em", marginRight: "1em" }}>PUBLISHER STATUS PENDING</Nav.Item>
              </OverlayTrigger>}
            {renderLoginButton()}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

