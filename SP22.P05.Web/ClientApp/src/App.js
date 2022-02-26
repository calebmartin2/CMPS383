import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Navmenu } from "./components/Navmenu";
import "./App.css"

function App() {
  return (
    <div className="App bg-black text-white">
      <Navmenu />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    </div>
  );
}

export default App;
