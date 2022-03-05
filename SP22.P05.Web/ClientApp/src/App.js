import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import Login from "./components/Login";
import { PublisherPortal } from "./components/Publisher/PublisherPortal";
import "./App.css"
import SignUp from "./components/SignUp";
import { Container } from "react-bootstrap";
import { AdminPortal } from "./components/Admin/AdminPortal";
import { AdminAddTags } from "./components/Admin/AdminAddTags";
import PublisherSignUp from "./components/Publisher/PublisherSignUp";
import axios from "axios";

function App() {

 // TODO: fix this nonsense, it sort of refreshes user data, but it's very shaky. Refreshing twice will update the state
  function refreshUserInfo() {
    axios.get('/api/authentication/me', {
    })
      .then(function (response) {
        console.log(response.data);
        console.log(localStorage.getItem('user'));

        if (!(localStorage.getItem('user') === response.data)) {
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(response.data))
          console.error("User data different, refreshing.")
        }
        console.warn("User data same, skipping.")
        // localStorage.setItem('user', JSON.stringify(response.data))
      })
      .catch(function (error) {
        localStorage.removeItem('user');
        console.log(error);
      });
  }


  return (
    <div className="App text-white">
      {refreshUserInfo()}
      <Navmenu />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/publisher" element={<PublisherPortal />} />
          <Route path="/publisher/signup" element={<PublisherSignUp />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route exact path="/admin/add-tags" element={<AdminAddTags />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
