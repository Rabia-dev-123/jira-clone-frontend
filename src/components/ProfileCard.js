import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

function ProfileCard({ user, setUser , setNotification }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
<ProfileCard user={user} setUser={setUser} setNotification={setNotification} />

  const handleButtonClick = () => {
    if (user.role === 'admin') navigate("/admin");
    else navigate("/user");
  };

  return (
    <>
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
  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
</div>


        {/* Middle: User Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "6px",
            flexGrow: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <strong style={{ fontSize: "24px" }}>{user.name}</strong>
            <FontAwesomeIcon
              icon={faPen}
              style={{
                color: "#0052CC",
                cursor: "pointer",
                fontSize: "16px",
                transition: "color 0.2s",
              }}
              title="Edit Profile"
              onClick={() => setModalOpen(true)}
              onMouseOver={(e) => e.target.style.color = "#172B4D"}
              onMouseOut={(e) => e.target.style.color = "#0052CC"}
            />
          </div>
          <span style={{ color: "#888", fontSize: "14px" }}>{user.email}</span>
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

      {/* Edit Profile Modal */}
      {modalOpen && (
        <EditProfileModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={user}
          setUser={setUser} // <-- this will update parent state
           setNotification={setNotification} 
        />
      )}
    </>
  );
}

export default ProfileCard;
