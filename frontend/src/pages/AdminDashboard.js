import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaList, FaUsers, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import { categories } from '../constants/categories';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('add');
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    category: '',
    address: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isVeg: false,
  });

  const cuisineTypes = [
    'Italian',
    'Indian',
    'Chinese',
    'Mexican',
    'Japanese',
    'Thai'
  ];

  useEffect(() => {
    fetchRestaurants();
    fetchUsers();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate all required fields
      if (!newRestaurant.name || !newRestaurant.cuisine || 
          !newRestaurant.category || !newRestaurant.address || 
          !newRestaurant.image) {
        throw new Error('All fields are required');
      }

      console.log('Sending restaurant data:', newRestaurant);
      
      const response = await axios.post(
        'http://localhost:5000/api/restaurants', 
        newRestaurant,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Server response:', response.data);
      
      setNewRestaurant({
        name: '',
        cuisine: '',
        category: '',
        address: '',
        image: ''
      });
      
      await fetchRestaurants();
      alert('Restaurant added successfully!');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert(`Failed to add restaurant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
        fetchRestaurants(); // Refresh the list
        alert('Restaurant deleted successfully');
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        alert('Failed to delete restaurant');
      }
    }
  };

  const fetchMenuItems = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/menu/restaurant/${restaurantId}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/menu', {
        ...newMenuItem,
        restaurantId: selectedRestaurant._id,
        price: parseFloat(newMenuItem.price)
      });
      
      fetchMenuItems(selectedRestaurant._id);
      setNewMenuItem({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        isVeg: false
      });
      alert('Menu item added successfully!');
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/${itemId}`);
        fetchMenuItems(selectedRestaurant._id);
        alert('Menu item deleted successfully!');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    // Redirect to main sign-in page
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h1>Admin Panel</h1>
        <div className="admin-nav">
          <button 
            className={`nav-btn ${activeSection === 'add' ? 'active' : ''}`}
            onClick={() => setActiveSection('add')}
          >
            <FaUtensils /> Add Restaurant
          </button>
          <button 
            className={`nav-btn ${activeSection === 'view' ? 'active' : ''}`}
            onClick={() => setActiveSection('view')}
          >
            <FaList /> View Restaurants
          </button>
          <button 
            className={`nav-btn ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <FaUsers /> Users
          </button>
          <button 
            className="nav-btn logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        {activeSection === 'add' && (
          <section className="add-restaurant">
            <h2>Add New Restaurant</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                  required
                />
              </div>

              <div className="input-field">
                <select
                  value={newRestaurant.cuisine}
                  onChange={(e) => setNewRestaurant({...newRestaurant, cuisine: e.target.value})}
                  required
                >
                  <option value="">Select Cuisine Type</option>
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div className="input-field">
                <select
                  value={newRestaurant.category}
                  onChange={(e) => setNewRestaurant({...newRestaurant, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-field">
                <input
                  type="text"
                  placeholder="Address"
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                  required
                />
              </div>

              <div className="input-field">
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newRestaurant.image}
                  onChange={(e) => setNewRestaurant({...newRestaurant, image: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Adding...' : 'Add Restaurant'}
              </button>
            </form>
          </section>
        )}

        {activeSection === 'view' && (
          <section className="view-restaurants">
            <h2>All Restaurants</h2>
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
                    <div className="info-content">
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
                  <div className="card-actions">
                    <button 
                      className="manage-menu-btn"
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
                      <FaUtensils /> Add Menu
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(restaurant._id)}
                    >
                      <FaTrash /> Delete Restaurant
                    </button>
                  </div>
                </div>
              ))}

              {selectedRestaurant && (
                <div className="menu-modal">
                  <div className="menu-modal-content">
                    <button className="modal-close-btn" onClick={() => setSelectedRestaurant(null)}>×</button>
                    <h2>Manage Menu - {selectedRestaurant.name}</h2>
                    
                    <div className="menu-items-list">
                      <h3>Current Menu Items</h3>
                      <div className="menu-grid">
                        {menuItems.map(item => (
                          <div key={item._id} className="menu-item-card">
                            <img src={item.image} alt={item.name} />
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>{item.description}</p>
                              <p className="price">₹{item.price}</p>
                              <p className="category">{item.category}</p>
                              {item.isVeg && <span className="veg-badge">Veg</span>}
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteMenuItem(item._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleAddMenuItem} className="add-menu-form">
                      <h3>Add New Menu Item</h3>
                      <input
                        type="text"
                        placeholder="Item Name"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                        required
                      />
                      <textarea
                        placeholder="Description"
                        value={newMenuItem.description}
                        onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                        required
                      />
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={newMenuItem.image}
                        onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                        required
                      />
                      <select
                        value={newMenuItem.category}
                        onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Starters">Starters</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={newMenuItem.isVeg}
                          onChange={(e) => setNewMenuItem({...newMenuItem, isVeg: e.target.checked})}
                        />
                        Vegetarian
                      </label>
                      <button type="submit" className="submit-btn">Add Menu Item</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'users' && (
          <section className="users-section">
            <h2>Registered Users</h2>
            {users.length > 0 ? (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-users">No users found</div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;