import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import Login from "./components/Login";
import { PublisherPortal } from "./components/PublisherPortal";
import "./App.css"

function App() {
  return (
    <div className="App bg-black text-white">
      <Navmenu />
      <div className="main-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/publisher" element={<PublisherPortal />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
