
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login  from "./pages/login.jsx";
import Home from "./pages/home"

 function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="blogs" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
