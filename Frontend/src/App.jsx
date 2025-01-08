import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './Pages/login';
import Registration from './Pages/Registration';
import Dashboard from './Dashboard';




function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
