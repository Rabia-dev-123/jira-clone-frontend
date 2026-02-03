// ProfilePage.js - CORRECT IMPORTS
import React, { useState, useEffect } from "react";
import Header from "../components/Header"; // Header is in components folder
import ProfileCard from "../components/ProfileCard"; // ProfileCard is also in components folder
import "./ProfilePage.css";
import Notification from "../components/Notification";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState(null);


  useEffect(() => {
    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } else {
      // If no user, redirect to signup
      window.location.href = '/signup';
    }

    // Check if we should show success message
    const shouldShowSuccess = localStorage.getItem('showSuccessMessage');
    if (shouldShowSuccess === 'true') {
      setShowSuccess(true);
      localStorage.removeItem('showSuccessMessage');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ background: "#f4f5f7", minHeight: "100vh" }}>
      {/* Header Component */}
      <Header />
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <span className="success-icon">✓</span>
          Sign up successful!
        </div>
      )}
{notification && (
  <Notification 
    type={notification.type} 
    message={notification.message} 
    duration={notification.duration || 4000} 
    onClose={() => setNotification(null)} 
  />
)}
      {/* Main Content - Centered */}
      <div style={{
        display: "flex",
        flexDirection: "column",
      alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 24px",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Welcome Message */}
      <h1 
  style={{ 
       marginTop: "120px",
       marginBottom: "40px",
       fontSize: "48px",
       textAlign: "left",
       fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
       fontWeight: 800
  }}
>
  Welcome, <span style={{ color: "#FCA700", fontWeight: 700 }}>
    {user.name ? user.name.split(' ')[0] : "User"}
  </span>.
</h1>

        {/* Profile Card - Centered */}
      <ProfileCard user={user} setUser={setUser} setNotification={setNotification} />
      </div>
    </div>
  );
}

export default ProfilePage;