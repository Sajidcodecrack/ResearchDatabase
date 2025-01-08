import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.data.success) {
        setMessage('Login successful!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setMessage(response.data.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred while logging in. Please try again later.');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-extrabold text-center mb-4 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleRegister}
          className="mt-4 w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-50"
        >
          Register
        </button>
        {message && <div className="mt-4 text-center text-green-500 font-bold">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
