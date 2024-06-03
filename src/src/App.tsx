import { Route, Routes } from "react-router";
import "./App.css";
import Plan from "./pages/Plan";
import Workers from "./pages/Workers";

function App() {
  return (
    <Routes>
      <Route path="/workers" element={<Workers />} />
      <Route path="/" element={<Plan />} />
    </Routes>
  );
}

export default App;
