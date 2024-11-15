import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login/Login';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import Home from './pages/home/Home';
import RegisterUser from './pages/register-user/RegisterUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/esqueceu-senha" element={<ForgotPassword />} />
        <Route path="/cadastrar" element={<RegisterUser />} />
        <Route path="/inicio" element={<Home/>} />                                                                               
      </Routes>
    </Router>
  );
}

export default App;
