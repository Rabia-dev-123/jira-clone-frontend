import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ users, onOpenCreate }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage when component mounts
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('showSuccessMessage');
    localStorage.setItem('showLogoutMessage', 'true'); // Set flag for logout notification
    
    // Close dropdown
    setOpen(false);
    
    // Navigate to login page
    navigate("/login");
    
    // Force reload to clear any cached state (optional)

  };

  // Show loading or default if no user
  if (!user) {
    return (
      <header className="jira-header">
        <div className="left">
          <div className="jira-logo-svg">
            <svg height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 48" fill="none" aria-labelledby="jiraTitle">
              <title id="jiraTitle">Jira</title>
              <path d="M106.535 26.5C106.535 32.02 108.743 34.78 112.837 34.78C116.379 34.78 119.553 32.526 119.553 27.42V25.58C119.553 20.474 116.655 18.22 113.297 18.22C108.835 18.22 106.535 21.164 106.535 26.5ZM119.553 38V33.86C118.081 36.896 115.321 38.46 111.779 38.46C105.661 38.46 102.579 33.262 102.579 26.5C102.579 20.014 105.799 14.54 112.239 14.54C115.597 14.54 118.173 16.058 119.553 19.048V15H123.509V38H119.553Z" fill="#101214"/> 
              <path d="M92.8638 24.4301V38.0001H88.9998V15.0001H92.8638V19.0481C94.1978 16.3341 96.4978 14.4021 101.006 14.6781V18.5421C95.9458 18.0361 92.8638 19.5541 92.8638 24.4301Z" fill="#101214"/> 
              <path d="M78.3359 8.92797C78.3359 7.17997 79.4859 6.16797 81.0959 6.16797C82.7059 6.16797 83.8559 7.17997 83.8559 8.92797C83.8559 10.676 82.7059 11.688 81.0959 11.688C79.4859 11.688 78.3359 10.676 78.3359 8.92797ZM79.0719 38V15H83.0279V38H79.0719Z" fill="#101214"/> 
              <path d="M69.43 29.0758V7.77783H73.57V28.7998C73.57 34.3658 71.132 38.1838 65.428 38.1838C63.266 38.1838 61.61 37.8158 60.46 37.4018V33.3998C61.702 33.9058 63.22 34.1818 64.738 34.1818C68.234 34.1818 69.43 32.0658 69.43 29.0758Z" fill="#101214"/> 
              <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#1868DB"/> 
              <path d="M17.9475 31.0469H15.2429C11.1638 31.0469 8.23755 28.5484 8.23755 24.8899H22.7804C23.5341 24.8899 24.0218 25.4252 24.0218 26.1837V40.8178C20.3861 40.8178 17.9475 37.8731 17.9475 33.7684V31.0469ZM25.1303 23.7745H22.4257C18.3466 23.7745 15.4203 21.3206 15.4203 17.6621H29.9631C30.7168 17.6621 31.2489 18.1528 31.2489 18.9113V33.5454C27.6132 33.5454 25.1303 30.6007 25.1303 26.496V23.7745ZM32.3573 16.5467H29.6527C25.5736 16.5467 22.6473 14.0482 22.6473 10.3896H37.1902C37.9439 10.3896 38.4316 10.925 38.4316 11.6389V26.273C34.7959 26.273 32.3573 23.3283 32.3573 19.2236V16.5467Z" fill="white"/>
            </svg>
          </div>
        </div>
        <div className="right">
          <div className="profile">
            <div className="avatar">?</div>
            <span className="username">Loading...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="jira-header">
      {/* LEFT SIDE - ONLY JIRA LOGO */}
      <div className="left">
        <div className="jira-logo-svg"> 
          <svg height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 48" fill="none" aria-labelledby="jiraTitle">
            <title id="jiraTitle">Jira</title>
            <path d="M106.535 26.5C106.535 32.02 108.743 34.78 112.837 34.78C116.379 34.78 119.553 32.526 119.553 27.42V25.58C119.553 20.474 116.655 18.22 113.297 18.22C108.835 18.22 106.535 21.164 106.535 26.5ZM119.553 38V33.86C118.081 36.896 115.321 38.46 111.779 38.46C105.661 38.46 102.579 33.262 102.579 26.5C102.579 20.014 105.799 14.54 112.239 14.54C115.597 14.54 118.173 16.058 119.553 19.048V15H123.509V38H119.553Z" fill="#101214"/> 
            <path d="M92.8638 24.4301V38.0001H88.9998V15.0001H92.8638V19.0481C94.1978 16.3341 96.4978 14.4021 101.006 14.6781V18.5421C95.9458 18.0361 92.8638 19.5541 92.8638 24.4301Z" fill="#101214"/> 
            <path d="M78.3359 8.92797C78.3359 7.17997 79.4859 6.16797 81.0959 6.16797C82.7059 6.16797 83.8559 7.17997 83.8559 8.92797C83.8559 10.676 82.7059 11.688 81.0959 11.688C79.4859 11.688 78.3359 10.676 78.3359 8.92797ZM79.0719 38V15H83.0279V38H79.0719Z" fill="#101214"/> 
            <path d="M69.43 29.0758V7.77783H73.57V28.7998C73.57 34.3658 71.132 38.1838 65.428 38.1838C63.266 38.1838 61.61 37.8158 60.46 37.4018V33.3998C61.702 33.9058 63.22 34.1818 64.738 34.1818C68.234 34.1818 69.43 32.0658 69.43 29.0758Z" fill="#101214"/> 
            <path d="M0 12C0 5.37258 5.37258 0 12 0H36C42.6274 0 48 5.37258 48 12V36C48 42.6274 42.6274 48 36 48H12C5.37258 48 0 42.6274 0 36V12Z" fill="#1868DB"/> 
            <path d="M17.9475 31.0469H15.2429C11.1638 31.0469 8.23755 28.5484 8.23755 24.8899H22.7804C23.5341 24.8899 24.0218 25.4252 24.0218 26.1837V40.8178C20.3861 40.8178 17.9475 37.8731 17.9475 33.7684V31.0469ZM25.1303 23.7745H22.4257C18.3466 23.7745 15.4203 21.3206 15.4203 17.6621H29.9631C30.7168 17.6621 31.2489 18.1528 31.2489 18.9113V33.5454C27.6132 33.5454 25.1303 30.6007 25.1303 26.496V23.7745ZM32.3573 16.5467H29.6527C25.5736 16.5467 22.6473 14.0482 22.6473 10.3896H37.1902C37.9439 10.3896 38.4316 10.925 38.4316 11.6389V26.273C34.7959 26.273 32.3573 23.3283 32.3573 19.2236V16.5467Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* CENTER: Search bar + Create button */}
      <div className="center">
        <div className="search-wrapper">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L15.8 15.8M10.5 18C6.91 18 4 15.09 4 11.5C4 7.91 6.91 5 10.5 5C14.09 5 17 7.91 17 11.5C17 15.09 14.09 18 10.5 18Z"
              stroke="#6B778C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <input
            type="text"
            placeholder="Search"
            className="search-bar"
          />
        </div>

        <button className="create-btn-blue" onClick={onOpenCreate}>
          <span className="plus-icon">+</span>
          Create
        </button>
      </div>

      {/* RIGHT SIDE: Profile - USING REAL USER DATA */}
      <div className="right">
        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="username">{user.name}</span>
        </div>

        {open && (
          <div className="dropdown">
            <p className="email">{user.email}</p>
            <hr />
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button 
              className="logout" 
              onClick={handleLogout}
              style={{
                color: "#DE350B",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;