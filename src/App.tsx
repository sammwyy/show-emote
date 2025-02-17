import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./views/Dashboard";
import Widget from "./views/Widget";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/widget" element={<Widget />} />
        <Route path="/widget.html" element={<Widget />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
