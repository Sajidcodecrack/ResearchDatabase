import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { SideNav } from "./component/sidebardash";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FaUserGraduate, FaChalkboardTeacher, FaFileAlt, FaLock } from "react-icons/fa";
import DonutChart from './component/Piechart';
import { Calendar } from "./component/Calender"; // Make sure this path is correct
const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [password, setPassword] = useState("");

  const handleNavigation = (role) => {
    if (role === "paper") {
      navigate("/paper");
    } else {
      setSelectedRole(role);
      setModalIsOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    fetch("http://localhost:5000/verifyPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: selectedRole, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate(`/${selectedRole}`);
        } else {
          alert("Incorrect password");
        }
      });
    setModalIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Side Navigation */}
        <div className="w-full md:w-64">
          <SideNav />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Welcome Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  Welcome to Exam Manager
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your academic resources efficiently
                </p>
              </div>

              {/* Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Student Card */}
                <button
                  onClick={() => handleNavigation("student")}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-6 text-purple-600 group-hover:text-purple-700 transition-colors">
                      <FaUserGraduate className="text-6xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Students
                    </h3>
                    <p className="text-gray-600 text-center">
                      Manage student records and exam registrations
                    </p>
                  </div>
                </button>

                {/* Teacher Card */}
                <button
                  onClick={() => handleNavigation("teacher")}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-6 text-blue-600 group-hover:text-blue-700 transition-colors">
                      <FaChalkboardTeacher className="text-6xl text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Teachers
                    </h3>
                    <p className="text-gray-600 text-center">
                      Manage faculty resources and exam papers
                    </p>
                  </div>
                </button>

                {/* Papers Card */}
                <button
                  onClick={() => handleNavigation("paper")}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-6 text-green-600 group-hover:text-green-700 transition-colors">
                      <FaFileAlt className="text-6xl" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Papers
                    </h3>
                    <p className="text-gray-600 text-center">
                      Access and manage examination papers
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </main>

          {/* Calendar Section */}
          <section className="px-8 pb-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex justify-center">
              
              <div className="w-[400px] overflow-x-auto rounded-md pr-10">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-lg p-4"
                  classNames={{
                    day: "hover:bg-blue-50 rounded-md p-2",
                    selected: "bg-blue-600 text-white hover:bg-blue-700",
                    today: "border border-blue-500 font-semibold",
                    nav_button: "hover:bg-gray-100 rounded-lg p-2",
                    head_cell: "text-gray-600 font-medium",
                    tile: "text-sm"
                  }}
                  modifiersClassNames={{
                    weekend: "text-red-500",
                    outside: "text-gray-400"
                  }}
                />
              </div>
              <div className="w-[400px]">
              <DonutChart />
              </div>
              
            </div>
          </section>
        </div>
      </div>

      {/* Password Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="flex justify-center items-center p-6"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <FaLock className="text-3xl text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}{" "}
              Access
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Please enter your password to continue
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                autoFocus
              />
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Unlock Access
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;