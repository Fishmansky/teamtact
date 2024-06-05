import { Route, Routes } from "react-router";
import Plan from "./pages/Plan";
import Workers from "./pages/Workers";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/workers" element={<Workers />} />
          <Route path="/" element={<Plan />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
