import React from 'react';
import 'react-calendar/dist/Calendar.css';
import { SideNav } from './component/sidebardash';
import Dash from './component/DashHome';

const Dashboard = () => (
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
        <button className="bg-purple-600 text-white py-5 px-10 rounded-xl shadow-lg hover:bg-purple-500 text-4xl w-96 h-40">Students</button>
      </div>
      <div className="w-full flex justify-center">
        <button className="bg-blue-600 text-white py-5 px-10 rounded-xl shadow-lg hover:bg-blue-500 text-4xl w-96 h-40">Teachers</button>
      </div>
      <div className="w-full flex justify-center">
        <button className="bg-green-600 text-white py-5 px-10 rounded-xl shadow-lg hover:bg-green-500 text-4xl w-96 h-40">Papers</button>
      </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
