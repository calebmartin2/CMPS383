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

function App() {
  return (
    <div className="App text-white">
      <Navmenu />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/publisher" element={<PublisherPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route exact path="/admin/add-tags" element={<AdminAddTags />} />
        </Routes>
        </Container>
    </div>
  );
}

export default App;
