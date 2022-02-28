import { Navbar, Container } from "react-bootstrap";
import "./Navmenu.css";
import iceLogo from '../content/ice_logo.png';
import { Button } from "react-bootstrap";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { checkForRole } from "./checkForRole";

export function Navmenu() {
  let location = useLocation()
  const loggedInUser = localStorage.getItem("user");
  let navigate = useNavigate();

  function handleLogout() {
    axios.post('/api/authentication/logout', {
    })
      .then(function (response) {
        console.log(response.data);
        localStorage.removeItem('user')
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
          <Navbar.Text>{JSON.parse(loggedInUser).userName}</Navbar.Text>
          <Button onClick={handleLogout} variant="danger">LOGOUT</Button>
        </>
      )
    } else if (location.pathname.toLowerCase() !== '/login') {
      return (
        <>
          <Link to="/Login"><Button variant="primary">LOGIN</Button></Link>
          <Link to="/SignUp"><Button variant="secondary">SignUp</Button></Link>
        </>
      )
    }
  }

  return (
    <>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container>
          <Navbar.Brand href="/" ><img className="navbar-image" src={iceLogo} alt={"ICE Logo"} /></Navbar.Brand>
          <Navbar.Text>{checkForRole("Publisher") ? null : "PUBLISHER"}</Navbar.Text>
          {renderLoginButton()}
        </Container>
      </Navbar>
    </>
  );
}

