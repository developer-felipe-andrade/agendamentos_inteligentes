import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login/Login';
import ForgotPassword from './pages/forgot-password/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/esqueceu-senha" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
