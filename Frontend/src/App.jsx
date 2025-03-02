import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './Pages/login';
import Registration from './Pages/Registration';
import Dashboard from './Dashboard';
import Student from './Pages/Student';
import Dash from './component/DashHome'; // Import DashHome
import Teacher from './Teacher';
import Paper from './Paper';
import CollaborationPage from './Pages/CollaborationPage';
import ProjectPage from './Pages/ProjectPage';
// Import Calender



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Student" element={<Student />} />
      <Route path="/Teacher" element={<Teacher />} />
      <Route path="/Paper" element={<Paper />} />
      <Route path="/CollaborationPage" element={<CollaborationPage />} />
      <Route path="/ProjectPage" element={<ProjectPage />} />
      



    </Routes>
  );
}

export default App;