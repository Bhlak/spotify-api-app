import { BrowserRouter as Router } from "react-router-dom";
import Pages from "./pages/Pages";
import styled from "styled-components";

function App() {
  return (
    <Router>
      <Pages />
    </Router>
  );
}

export default App;
