import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './RestaurantsByCategory.css';

const RestaurantsByCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("Select Location");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log('Fetching restaurants for category:', category);
        const response = await axios.get('http://localhost:5000/api/restaurants');
        console.log('All restaurants:', response.data);
        
        const filtered = response.data.filter(restaurant => 
          restaurant.category && 
          restaurant.category.toLowerCase() === category.toLowerCase()
        );
        
        console.log('Filtered restaurants:', filtered);
        setRestaurants(filtered);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [category]);

  return (
    <div className="dashboard-container">
      <Navbar address={address} />
      <div className="category-page">
        <div className="category-header">
          <h1>{category} Restaurants</h1>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Back
          </button>
        </div>
        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : restaurants.length > 0 ? (
          <div className="restaurants-grid">
            {restaurants.map(restaurant => (
              <div key={restaurant._id} className="restaurant-card">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant';
                  }}
                />
                <div className="restaurant-info">
                  <div className="left-content">
                    <h3>{restaurant.name}</h3>
                    <p className="address">📍 {restaurant.address}</p>
                  </div>
                  <div className="right-content">
                    <p className="cuisine">🍽️ {restaurant.cuisine}</p>
                    <p className="category">🏷️ {restaurant.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">No restaurants found in {category} category</div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsByCategory;