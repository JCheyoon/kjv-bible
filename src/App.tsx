import Bible from "./components/Bible.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/random" replace />} />
        <Route path="/random" element={<Bible />} />
        <Route path="/bible/:book/:chapter/:verse" element={<Bible />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
