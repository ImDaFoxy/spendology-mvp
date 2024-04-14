import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { SignUp } from './signUp'; // Adjust the import path according to your project structure
import { ExpenseTracker } from '../expense-tracker/index'; // Import the ExpenseTracker component
import './index.css';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Get the navigate function from React Router

  const handleSignIn = async () => {
    try {
      // Simulating a successful sign-in for demonstration purposes
      // In a real application, this would be replaced with your actual sign-in logic
      const response = await axios.post('http://localhost:3001/signin', { email, password });
      console.log(response.data);

      // Redirect to the ExpenseTracker page after successful sign-in
      console.log('Sign In Response:', response.data);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      navigate('/expense-tracker');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  useEffect(() => {
    // Check if user data exists in local storage on component mount
    const userData = localStorage.getItem('userData');
    console.log('User Data from Local Storage:', userData);
    if (userData) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className='sign-in-white'>
        <h1>Welcome to Spendology</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='login-with-google-btn' onClick={handleSignIn}>Sign In</button>
        <br />
        <Link to="./auth/signUp">Register</Link>
      </div>
    </div>
  );
};

export default SignIn; // Adjust according to how you plan to use this component
