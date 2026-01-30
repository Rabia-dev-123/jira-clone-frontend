// ProfileCard.js - Updated
import React from "react";
import { useNavigate } from "react-router-dom";

function ProfileCard({ user }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (user.role === 'admin') {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "900px",
        padding: "24px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "14px 14px 0px #0052CC",
        background: "#fff",
        gap: "16px",
      }}
    >
       {/* Left: Initials Avatar */}
      <div
        style={{
          backgroundColor: "#B3DF72",
          width: "100px",
          height: "100px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "36px",
          color: "#4C6B1F",
          flexShrink: 0,
        }}
      >
        {user.name.slice(0, 2).toUpperCase()}
      </div>

      {/* Middle: User Info with Profile Icon */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "12px",
          flexGrow: 1,
        }}
      >
        <strong style={{ fontSize: "24px" }}>{user.name}</strong>
        
        {/* Profile Icon instead of email */}
        {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="#666" 
            style={{ marginRight: "4px" }}
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span style={{ color: "#666", fontSize: "16px" }}>
            Profile
          </span>
        </div> */}
        
        {/* Optional: Add email in smaller text */}
        <span style={{ color: "#888", fontSize: "14px" }}>
          {user.email}
        </span>
      </div>

      <button
        onClick={handleButtonClick}
        style={{
          background: "#FCA700",
          color: "#000",
          padding: "12px 24px",
          borderRadius: "20px",
          fontWeight: "bold",
          textDecoration: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          transition: "all 0.3s",
        }}
        onMouseOver={(e) => e.target.style.background = "#FFB524"}
        onMouseOut={(e) => e.target.style.background = "#FCA700"}
      >
        {user.role === 'admin' ? 'Go to Admin Panel' : 'Go to User Page'}
      </button>
    </div>
  );
}

export default ProfileCard;