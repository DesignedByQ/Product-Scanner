import React, { useState } from 'react';
import './LoginSignup.css';

import user_icon from './icons8-person-50.png';
import email_icon from './icons8-email-50.png';
import password_icon from './icons8-password-50.png';

const LoginSignup = () => {
  const [action, setAction] = useState('Login');

  // State for form fields
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Validation messages
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // State for server response
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Validation functions
  const validateName = (value) => {
    if (!/^[A-Za-z]+$/.test(value)) {
      setNameError('Name must only contain letters.');
    } else if (value.length > 10) {
      setNameError('Name must be less than 10 characters.');
    } else {
      setNameError('');
    }
    setName(value);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
    setEmail(value);
  };

  const validatePassword = (value) => {
    if (value.length > 20) {
      setPasswordError('Password must not exceed 20 characters.');
    } else {
      setPasswordError('');
    }
    setPassword(value);
  };

  const handleSignUp = async () => {
    if (!username || !email || !password || nameError || emailError || passwordError) {
      return;
    }

    const data = { username, email, password };
//http://localhost:8080/brownskincosmetics/signup
    try {
      const res = await fetch('https://scanner-be-58206242031.us-central1.run.app/brownskincosmetics/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage(
          'Your request has been successfully submitted, a member from admin will notify you via email if you get approved to access this app.'
        );
        setMessageType('success');
      } else {
        setMessage(
          'Your request was not received, check your network and try again otherwise please contact Majna.'
        );
        setMessageType('error');
      }
    } catch (err) {
      console.error(err);
      setMessage(
        'Your request was not received, check your network and try again otherwise please contact Majna.'
      );
      setMessageType('error');
    }
  };

  // Button disabled if errors or empty fields
  const isFormInvalid =
    !username || !email || !password || nameError || emailError || passwordError;

  return (
    <div>
      <h1>G.O Cosmetics Scanner</h1>
      <p>Please choose an option to continue.</p>

      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
      </div>

      <div className="inputs">
        {action === 'Login' ? null : (
          <div className="input">
            <img src={user_icon} alt="Username" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => validateName(e.target.value)}
            />
          </div>
        )}
        {nameError && <p className="error-message">{nameError}</p>}

        <div className="input">
          <img src={email_icon} alt="email" />
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
          />
        </div>
        {emailError && <p className="error-message">{emailError}</p>}

        <div className="input">
          <img src={password_icon} alt="password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
          />
        </div>
        {passwordError && <p className="error-message">{passwordError}</p>}
      </div>

      {action === 'Sign Up' ? null : (
        <div className="forgot-password">
          Lost Password? <span>Click Here!</span>
        </div>
      )}

      <div className="submit-container">
        <div
          className={action === 'Login' ? 'submit gray' : 'submit'}
          onClick={() => {
            if (action === 'Sign Up' && !isFormInvalid) {
              handleSignUp();
            } else {
              setAction('Sign Up');
            }
          }}
          style={{ pointerEvents: isFormInvalid && action === 'Sign Up' ? 'none' : 'auto', opacity: isFormInvalid && action === 'Sign Up' ? 0.6 : 1 }}
        >
          Sign Up
        </div>

        <div
          className={action === 'Sign Up' ? 'submit gray' : 'submit'}
          onClick={() => setAction('Login')}
        >
          Login
        </div>
      </div>

      {/* Response message */}
      {message && (
        <p className={`response-message ${messageType}`}>{message}</p>
      )}

      <div className="OTP">
         
         <input type="text" placeholder="Enter OTP" />
         <div className="submit gray" disabled>
           Verify OTP
         </div>
      </div>

      <div className="submit">Submit</div>

        

    </div>
  );
};

export default LoginSignup;
