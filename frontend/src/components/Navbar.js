import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaBars, FaMapMarkerAlt } from "react-icons/fa";
import './Navbar.css';

const Navbar = ({ address, setIsMapOpen }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const scrollToRestaurants = () => {
    document.getElementById('restaurants-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <FaBars className="menu-icon" />
        <span className="logo">FREE FOOD.</span>
        <div className="address-container">
          <FaMapMarkerAlt className="location-icon" />
          <span className="address-text">{address}</span>
          <button className="change-address-btn" onClick={() => setIsMapOpen(true)}>
            Change
          </button>
        </div>
      </div>
      
      <div className="nav-links">
        <a href="#" onClick={scrollToRestaurants}>Restaurants</a>
        <a href="#">About Us</a>
      </div>

      <div className="navbar-right">
        <FaShoppingCart className="cart-icon" />
        <button className="confirm-order">Confirm Order</button>
        <div className="profile-container">
          <FaUserCircle 
            className="profile-icon" 
            onClick={() => setIsProfileOpen(!isProfileOpen)} 
          />
          {isProfileOpen && (
            <div className="profile-dropdown">
              <a href="#">Account Info</a>
              <a href="#">Recent Orders</a>
              <a href="#">Payment Methods</a>
              <a href="#">Addresses</a>
              <a href="#" className="logout" onClick={handleLogout}>
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;