// src/components/Notification.js
import React, { useEffect, useState } from "react";
import "./Notification.css";

const Notification = ({ type, message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = type === "success" ? "#00875A" : 
                  type === "error" ? "#DE350B" : 
                  type === "info" ? "#0052CC" : "#00875A";

  return (
    <div 
      className="notification"
      style={{
        backgroundColor: bgColor,
        animation: "slideIn 0.3s ease-out"
      }}
    >
      <span className="notification-icon">
        {type === "success" ? "✓" : 
         type === "error" ? "✗" : "!"}
      </span>
      {message}
    </div>
  );
};

export default Notification;