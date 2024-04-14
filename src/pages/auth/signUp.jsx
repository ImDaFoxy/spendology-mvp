import React, { useState } from 'react';
import { BrowserRouter as Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {SignIn} from './index';
import './index.css';

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:3001/signup', { name, email, password });
      console.log(response.data);
      navigate('/expense-tracker');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="login-page">
      <div className='sign-in-white'>
      <div className='create-account'>
        <h2>Create Account</h2>
      </div>
      <input type="text" className="input-name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" className="input-email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="input-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className='login-with-google-btn' onClick={handleSignUp}>Sign Up</button>
      <br />
      Already have an account? 
      <br />
      <Link to="/"> Click here to sign in</Link>
      </div>
    </div>
  );
};
