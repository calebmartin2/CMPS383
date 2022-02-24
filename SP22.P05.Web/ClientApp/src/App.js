import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { NavMenu } from "./components/NavMenu";

function App() {
  return (
    <div className="App">
      <NavMenu />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
    </div>
  );
}

export default App;
