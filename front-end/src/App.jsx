import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login/Login';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import Home from './pages/home/Home';
import RegisterUser from './pages/register-user/RegisterUser';
import SchedulingCalendar from './pages/calendar/SchedulingCalendar';
import AproveUsers from './pages/users/AproveUsers';
import Resource from './pages/resource/Resource';
import Classroom from './pages/classroom/Classroom';
import ConfirmPassword from './pages/forgot-password/ConfirmPassword';
import FormClassroom from './pages/classroom/FormClassroom';
import ClassroomsAvaliable from './pages/reservePerHour/ClassroomsAvaliable';
import AproveSchedule from './pages/aprove-schedule/AproveSchedule';
import ReportReserve from './pages/report/ReportReserve';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/recover" element={<ConfirmPassword />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/reserve" element={<SchedulingCalendar />} />
        <Route path="/aprove-users" element={<AproveUsers />} />
        <Route path="/resources" element={<Resource/>} />
        <Route path="/classrooms" element={<Classroom />} />
        <Route path="/classroom/:id" element={<FormClassroom />} />
        <Route path="/classroom" element={<FormClassroom />} />
        <Route path="/classrooms-avaliable" element={<ClassroomsAvaliable />} />
        <Route path="/aprove-schedule" element={<AproveSchedule />} />
        <Route path="/report-reserve" element={<ReportReserve />} />
        <Route path="/" element={<Home/>} />                                                                               
      </Routes>
    </Router>
  );
}

export default App;
