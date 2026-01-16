import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./constant/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Skills from "./pages/Skills/Skills";
import Contact from "./pages/Contact/Contact";
import DotGrid from "./utils/DotGrid";

function App() {
  return (
    <div className="App" style={{ scrollBehavior: "smooth" }}>
      <DotGrid /> 
      <BrowserRouter basename={import.meta.env.MODE === "production" ? "/jeel-portfolio" : ""}>
        <div className="main-canvas">
          <div className="navbar-area">
            <Navbar />
          </div>
          <div className="main-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
