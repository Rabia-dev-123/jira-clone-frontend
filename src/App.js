// App.js - Updated version
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ProfilePage from "./pages/ProfilePage";
import AdminBoardsPage from "./pages/AdminBoardsPage";
import UserBoardsPage from "./pages/UserBoardsPage";
import Notification from "./components/Notification";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Create a wrapper component that has access to location
function AppContent({ setNotification, notification }) {
  const location = useLocation();

// In App.js - Add to the useEffect
useEffect(() => {
  console.log("🔍 DEBUG: Route changed to:", location.pathname);
  
  // Check for logout message
  const logoutMessage = localStorage.getItem('showLogoutMessage');
  if (logoutMessage === 'true') {
    setNotification({
      type: "error",
      message: "Logged out successfully!"
    });
    localStorage.removeItem('showLogoutMessage');
  }

  // Check for login message
  const loginMessage = localStorage.getItem('showLoginMessage');
  if (loginMessage === 'true') {
    setNotification({
      type: "success",
      message: "Logged in successfully!"
    });
    localStorage.removeItem('showLoginMessage');
  }

  // NEW: Check for board created message
  const boardCreatedMessage = localStorage.getItem('showBoardCreatedMessage');
  if (boardCreatedMessage === 'true') {
    setNotification({
      type: "success",
      message: "Board created successfully!"
    });
    localStorage.removeItem('showBoardCreatedMessage');
  }

  // NEW: Check for board deleted message
  const boardDeletedMessage = localStorage.getItem('showBoardDeletedMessage');
  if (boardDeletedMessage === 'true') {
    setNotification({
      type: "error",
      message: "Board deleted successfully!"
    });
    localStorage.removeItem('showBoardDeletedMessage');
  }
}, [location.pathname, setNotification]);

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setNotification={setNotification} />} />
        <Route path="/profile" element={<ProfilePage />} />
      // In App.js - Pass setNotification to AdminBoardsPage
<Route path="/admin" element={<AdminBoardsPage setNotification={setNotification} />} />
      <Route path="/user" element={<UserBoardsPage setNotification={setNotification} />} />
      </Routes>
    </>
  );
}

function App() {
  const [notification, setNotification] = useState(null);

  return (
    <Router>
      <AppContent 
        setNotification={setNotification} 
        notification={notification} 
      />
    </Router>
  );
}

export default App;