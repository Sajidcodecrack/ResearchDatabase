import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { SideNav } from './component/sidebardash';
import Dash from './component/DashHome';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [password, setPassword] = useState('');

  const handleNavigation = (role) => {
    setSelectedRole(role);
    setModalIsOpen(true);
  };

  const handlePasswordSubmit = () => {
    // Add logic to verify password
    fetch('http://localhost:5000/verifyPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: selectedRole, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate(`/${selectedRole}`);
        } else {
          alert('Incorrect password');
        }
      });
    setModalIsOpen(false);
  };

  return (
    <div className='flex' style={{ backgroundColor: '#E5D9F2' }}>
      <div>
        <SideNav />
      </div>
      <div>
        <Dash />
      </div>
      
      <div>
        <div><h1 className="text-5xl font-bold">Welcome to the Dashboard</h1></div>

        <div className="flex flex-col items-center gap-8 mt-24">
          <div className="w-full flex justify-center">
            <button
              className="bg-purple-600 text-white py-5 px-10 rounded-xl shadow-lg hover:bg-purple-500 text-4xl w-96 h-40"
              onClick={() => handleNavigation('student')}
            >
              Students
            </button>
          </div>
          <div className="w-full flex justify-center">
            <button
              className="bg-blue-600 text-white py-5 px-10 rounded-xl shadow-lg hover:bg-blue-500 text-4xl w-96 h-40"
              onClick={() => handleNavigation('teacher')}
            >
              Teachers
            </button>
          </div>
          <div className="w-full flex justify-center">
            <button
              className="bg-green-600 text-white py-5 px-10 rounded-xl shadow-lg hover:bg-green-500 text-4xl w-96 h-40"
              onClick={() => handleNavigation('paper')}
            >
              Papers
            </button>
          </div>
        </div>

        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <h2>Enter Password</h2>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlePasswordSubmit}>Submit</button>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
