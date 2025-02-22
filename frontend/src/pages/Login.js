import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../styles.css";

// Add this mock login function at the top of your file, after the imports
const loginUser = async (email, password) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1500); // 1.5 seconds delay to show loading animation
  });
};
const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'Admin'
};
const Login = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isAdminMode) {
      // Add admin authentication logic here
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } else {
      // Existing user login logic
      try {
        const result = await loginUser(email, password);
        if (result.success) {
          setLoginSuccess(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful');
        setRegistrationSuccess(true); // Show success animation
        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        
        // Switch to sign in mode after delay
        setTimeout(() => {
          setRegistrationSuccess(false);
          setIsSignUpMode(false);
        }, 1500);
      } else {
        console.error('Registration failed:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {loginSuccess && (
        <div className="login-success-overlay">
          <div className="success-animation">
            <div className="checkmark">✓</div>
            <div className="loading-bar"></div>
            <p>Successfully logged in!</p>
          </div>
        </div>
      )}
      
      {registrationSuccess && (
        <div className="login-success-overlay">
          <div className="success-animation">
            <div className="checkmark">✓</div>
            <div className="loading-bar"></div>
            <p>Registration successful!</p>
          </div>
        </div>
      )}
      
      <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={handleSubmit} className="sign-in-form">
              <h2 className="title">{isAdminMode ? 'Admin Login' : 'Sign in'}</h2>
              
              <div className="login-type-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${!isAdminMode ? 'active' : ''}`}
                  onClick={() => setIsAdminMode(false)}
                >
                  User
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${isAdminMode ? 'active' : ''}`}
                  onClick={() => setIsAdminMode(true)}
                >
                  Admin
                </button>
              </div>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <button type="submit" className="btn">Sign in</button>
            </form>
            <form onSubmit={handleSignUp} className="sign-up-form">
              <h2 className="title">Sign up</h2>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              <button type="submit" className="btn">Sign up</button>
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>Sign up and discover great amount of new opportunities!</p>
              <button className="btn transparent" onClick={toggleMode}>Sign up</button>
            </div>
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>Sign in and continue your journey with us!</p>
              <button className="btn transparent" onClick={toggleMode}>Sign in</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
