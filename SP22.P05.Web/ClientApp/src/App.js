import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navmenu } from "./components/Navmenu";
import NotFoundPage from "./components/NotFoundPage";
import Login from "./components/Login";
import "./App.css"
import SignUp from "./components/SignUp";

function App() {
  return (
    <div className="App bg-black text-white">
      <Navmenu />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
