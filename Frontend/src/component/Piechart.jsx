import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Piechart = ({ refreshKey }) => {
  const [userCounts, setUserCounts] = useState({ students: 0, teachers: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/user-counts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // First, get the response as text
      })
      .then((text) => {
        console.log('Response text:', text); // Log the response text
        return JSON.parse(text); // Then, parse it as JSON
      })
      .then((data) => {
        if (data.success) {
          setUserCounts({ students: data.students, teachers: data.teachers });
        }
      })
      .catch((error) => console.error('Error fetching user counts:', error));
  }, [refreshKey]);

  const data = [
    { name: 'Students', value: userCounts.students, color: '#FFA53F' },
    { name: 'Teachers', value: userCounts.teachers, color: '#EC6B56' }
  ];

  const totalUsers = userCounts.students + userCounts.teachers;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              formatter={(value) => <span className="text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centered Total Users Count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
            <p className="text-sm text-gray-600 mt-1">Total Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piechart;