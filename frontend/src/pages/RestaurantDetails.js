import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`),
          axios.get(`http://localhost:5000/api/menu/restaurant/${id}`)
        ]);
        setRestaurant(restaurantRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id]);

  return (
    <div className="restaurant-details">
      <Navbar />
      {loading ? (
        <div className="loading">Loading...</div>
      ) : restaurant ? (
        <>
          <div className="restaurant-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </button>
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="restaurant-banner"
            />
            <div className="restaurant-info">
              <h1>{restaurant.name}</h1>
              <p className="cuisine">{restaurant.cuisine}</p>
              <p className="address">📍 {restaurant.address}</p>
            </div>
          </div>

          <div className="menu-section">
            <h2>Menu</h2>
            {menuItems.length > 0 ? (
              <div className="menu-grid">
                {menuItems.map(item => (
                  <div key={item._id} className="menu-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="description">{item.description}</p>
                      <div className="item-footer">
                        <span className="price">₹{item.price}</span>
                        <button className="add-to-cart">Add +</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-menu">No menu items available</p>
            )}
          </div>
        </>
      ) : (
        <div className="error">Restaurant not found</div>
      )}
    </div>
  );
};

export default RestaurantDetails;