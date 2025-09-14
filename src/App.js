import './App.css';
import Checkout from './Checkout';
import LoginSignup from './LoginSignup/LoginSignup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<LoginSignup />} />
            <Route path="/Checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;