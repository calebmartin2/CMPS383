import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import Login from "./components/Login";
import { PublisherPortal } from "./components/Publisher/PublisherPortal";
import "./App.css"
import SignUp from "./components/SignUp";
import { Container } from "react-bootstrap";

function App() {
  return (
    <div className="App bg-black text-white">
      <Navmenu />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/publisher" element={<PublisherPortal />} />
        </Routes>
        </Container>
    </div>
  );
}

export default App;
