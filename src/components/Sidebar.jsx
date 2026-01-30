// Sidebar.js - Updated for consistent logout notification
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ setView, setNotification }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("🔴 Sidebar: Admin logging out...");
    
    // Clear all user data
    localStorage.removeItem('user');
    
    // Always use localStorage flag as backup (works with App.js useEffect)
    localStorage.setItem('showLogoutMessage', 'true');
    
    // Also use setNotification if available (immediate)
    if (setNotification) {
      console.log("✅ Sidebar: Using setNotification prop");
      setNotification({
        type: "error", // RED color
        message: "Logged out successfully!"
      });
    }
    
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <button onClick={() => setView("boards")}>Boards</button>
      <button onClick={() => setView("users")}>Users</button>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;