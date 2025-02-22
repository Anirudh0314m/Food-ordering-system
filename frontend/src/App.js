import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantsByCategory from './pages/RestaurantsByCategory';
import RestaurantDetails from './pages/RestaurantDetails';
import "./styles.css";

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/category/:category" element={<RestaurantsByCategory />} />
      <Route path="/restaurant/:id" element={<RestaurantDetails />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
