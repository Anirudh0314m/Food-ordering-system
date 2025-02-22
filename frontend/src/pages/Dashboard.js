import React, { useState, useEffect, useCallback } from "react";
import { FaUserCircle, FaSearch, FaShoppingCart, FaBars, FaMapMarkerAlt, FaStar, FaClock, FaUtensils } from "react-icons/fa";
import ReactMapGL, { Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Dashboard.css";
import Navbar from '../components/Navbar';

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946
};

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5pcnVkaDAzMTRtIiwiYSI6ImNtNzR2NDFhMzBja20ycXNjZDdwc3VzcmwifQ.zJGmj5f_nuLyNY-WCfx6dA'; // Replace with your token

const geocoder = new MapboxGeocoder({
  accessToken: MAPBOX_TOKEN,
  mapboxgl: ReactMapGL,
  marker: false
});

const categories = [
  {
    id: 1,
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&h=300'
  },
  {
    id: 2,
    name: 'Burger',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=300&h=300'
  },
  {
    id: 3,
    name: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&h=300'
  },
  {
    id: 4,
    name: 'Chinese',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&h=300'
  },
  {
    id: 5,
    name: 'Pasta',
    image: 'https://plus.unsplash.com/premium_photo-1664472619078-9db415ebef44?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 6,
    name: 'Ice Cream',
    image: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=300&h=300'
  },

];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [address, setAddress] = useState("Select Location");
  const [location, setLocation] = useState(defaultCenter);
  const [viewport, setViewport] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 14
  });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = (place) => {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setLocation({ lat, lng });
    setAddress(place.formatted_address);
  };

  const handleLocationSearch = useCallback(async (searchText) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        const placeName = data.features[0].place_name;
        
        setViewport({
          ...viewport,
          longitude,
          latitude,
          zoom: 14
        });
        setAddress(placeName);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  }, [viewport]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Update viewport with current location
          setViewport({
            ...viewport,
            latitude,
            longitude,
            zoom: 14
          });

          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
              setAddress(data.features[0].place_name);
            }
          } catch (error) {
            console.error('Error getting address:', error);
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear any stored user data/tokens
    localStorage.clear();
    // Navigate to root URL (sign in page)
    navigate('/', { replace: true });
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.name}`);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query)
    );
    setFilteredRestaurants(filtered);
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="dashboard-container">
      <Navbar 
        address={address} 
        setIsMapOpen={setIsMapOpen} 
      />
      
      {/* Category Section - Moved to top */}
      <div className="dashboard-main">
        <h2 className="category-title">What are you interested in today?</h2>
        <div className="category-section">
          {categories.map(category => (
            <div 
              key={category.id} 
              className={`category-card ${selectedCategory?.id === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <img src={category.image} alt={category.name} />
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section - Moved below categories */}
      <div className="hero-section">
        <h1>Discover Restaurants that deliver near you</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for food, restaurants..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Add this section after your hero section */}
      <div id="restaurants-section" className="restaurants-section">
        <h2>{selectedCategory ? `Best ${selectedCategory.name} Places` : 'Popular Restaurants'}</h2>
        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map(restaurant => (
              <div 
                key={restaurant._id} 
                className="restaurant-card"
                onClick={() => handleRestaurantClick(restaurant._id)}
                style={{ cursor: 'pointer' }}
              >
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
        )}
      </div>

      {/* Interactive Map Section */}
      {isMapOpen && (
        <div className="map-modal">
          <div className="map-modal-content">
            <button className="close-modal" onClick={() => setIsMapOpen(false)}>×</button>
            <h2>Select Your Location</h2>
            
            <button 
              className="get-location-btn" 
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? 'Getting location...' : 'Use My Current Location'}
            </button>

            <div className="search-box-container">
              <input
                type="text"
                placeholder="Search your location..."
                className="location-input"
                onChange={(e) => {
                  if (e.target.value.length > 2) { // Only search if input is longer than 2 characters
                    handleLocationSearch(e.target.value);
                  }
                }}
              />
              <div className="search-suggestions">
                {/* Suggestions will appear here */}
              </div>
            </div>
            <ReactMapGL
              mapboxAccessToken={MAPBOX_TOKEN}
              initialViewState={viewport}
              style={{ width: '100%', height: '400px', borderRadius: '10px' }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onMove={evt => setViewport(evt.viewState)}
            >
              <Marker 
                longitude={viewport.longitude} 
                latitude={viewport.latitude}
                anchor="bottom"
                draggable
                onDragEnd={async (evt) => {
                  const newLng = evt.lngLat.lng;
                  const newLat = evt.lngLat.lat;
                  
                  // Reverse geocoding to get address from coordinates
                  try {
                    const response = await fetch(
                      `https://api.mapbox.com/geocoding/v5/mapbox.places/${newLng},${newLat}.json?access_token=${MAPBOX_TOKEN}`
                    );
                    const data = await response.json();
                    
                    if (data.features && data.features.length > 0) {
                      setAddress(data.features[0].place_name);
                    }
                    
                    setViewport({
                      ...viewport,
                      longitude: newLng,
                      latitude: newLat
                    });
                  } catch (error) {
                    console.error('Error getting address:', error);
                  }
                }}
              >
                <FaMapMarkerAlt style={{ fontSize: '2rem', color: '#a82d2d' }} />
              </Marker>
            </ReactMapGL>
            <button 
              className="confirm-location-btn"
              onClick={() => {
                setIsMapOpen(false);
              }}
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}

      {/* Promo Section */}
      <div className="promo-section">
        <p>What about privacy policy?</p>
        <p>This is simply dummy text of the printing and typesetting industry. Learn more about how we handle data privacy.</p>
        <a href="#">See more</a>
      </div>
    </div>
  );
};

export default Dashboard;
