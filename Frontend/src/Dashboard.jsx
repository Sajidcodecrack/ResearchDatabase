import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
//  import Calendar from 'react-calendar';
import Calendar from './component/calender';
import 'react-calendar/dist/Calendar.css';

const Sidebar = () => (
  <div className="w-64 bg-gray-800 text-white flex flex-col">
    <div className="p-4">Logo</div>
    <nav className="flex-grow">
      <Link to="/" className="block p-4 hover:bg-gray-700">Dashboard</Link>
      <Link to="/students" className="block p-4 hover:bg-gray-700">Students</Link>
      <Link to="/teachers" className="block p-4 hover:bg-gray-700">Teachers</Link>
      <Link to="/papers" className="block p-4 hover:bg-gray-700">Papers</Link>
    </nav>
  </div>
);

const Navbar = () => (
  <div className="bg-white shadow p-4">
    <div className="container mx-auto">Navbar</div>
  </div>
);

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

const Dashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="bg-white p-4 rounded shadow">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ right: 16 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="month"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey="desktop" type="number" hide />
          <Bar dataKey="desktop" layout="vertical" fill="var(--color-desktop)" radius={4}>
            <LabelList
              dataKey="month"
              position="insideLeft"
              offset={8}
              className="fill-[--color-label]"
              fontSize={12}
            />
            <LabelList
              dataKey="desktop"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ right: 16 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="month"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey="mobile" type="number" hide />
          <Bar dataKey="mobile" layout="vertical" fill="var(--color-mobile)" radius={4}>
            <LabelList
              dataKey="month"
              position="insideLeft"
              offset={8}
              className="fill-[--color-label]"
              fontSize={12}
            />
            <LabelList
              dataKey="mobile"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </div>
    </div>
    <div className="bg-white w-64 h-52 p-4 rounded shadow mb-4">
      <Calendar />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">Students</div>
      <div className="bg-white p-4 rounded shadow">Teachers</div>
      <div className="bg-white p-4 rounded shadow">Papers</div>
    </div>
  </div>
);



export default Dashboard;
