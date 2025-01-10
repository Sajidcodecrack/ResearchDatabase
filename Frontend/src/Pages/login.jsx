import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      if (response.data.success) {
        setMessage("Login successful!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(response.data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred while logging in. Please try again later.");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#F5EFFF] via-[#E5D9F2] to-[#CDC1FF]">
      <div className="bg-[#A294F9] p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <p className="text-sm text-center mb-8 text-gray-600">
        <p class="font-bold text-lg">Access your account to continue.</p>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <p class="font-bold text-lg">Email</p>
            </label>
            <input
              type="email"
              className="block w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
            <p class="font-bold text-lg">Password</p>

              
            </label>
            <input
              type="password"
              className="block w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold p-3 rounded-xl hover:bg-indigo-700 transition duration-200"
          >
            
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <button
            onClick={handleRegister}
            className="mt-2 text-indigo-500 font-semibold hover:underline"
          >
            Register
          </button>
        </div>
        {message && (
          <div className="mt-6 text-center text-green-600 font-bold">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Login;