import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* More routes will be added as pages are built */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
