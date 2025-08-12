import Bible from "./components/Bible.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bible />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
