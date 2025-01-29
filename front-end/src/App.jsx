import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login/Login';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import Home from './pages/home/Home';
import RegisterUser from './pages/register-user/RegisterUser';
import SchedulingCalendar from './pages/calendar/SchedulingCalendar';
import Users from './pages/users/Users';
import Resource from './pages/resource/Resource';
import Classroom from './pages/classrooms/Classroom';
import ConfirmPassword from './pages/forgot-password/ConfirmPassword';
import FormClassroom from './pages/classrooms/FormClassroom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recover" element={<ConfirmPassword />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/reserve" element={<SchedulingCalendar />} />
        <Route path="/users" element={<Users />} />
        <Route path="/resources" element={<Resource/>} />
        <Route path="/classrooms" element={<Classroom />} />
        <Route path="/classroom/:id" element={<FormClassroom />} />
        <Route path="/classroom" element={<FormClassroom />} />
        <Route path="/" element={<Home/>} />                                                                               
      </Routes>
    </Router>
  );
}

export default App;
