import React, { useState, useEffect } from "react";

export default function EditProfileModal({ open, onClose, user, setUser ,setNotification}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user.name);
      setEmail(user.email);
      setPassword("");
      setIsSubmitting(false);
    }
  }, [open, user]);

const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    const response = await fetch(`http://localhost:5000/api/v1/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        user: { 
          name, 
          email, 
          password: password || undefined 
        } 
      }),
      credentials: "include"
    });

    if (!response.ok) throw new Error("Failed to update profile");

    const data = await response.json();

    // 🔹 Handle different backend structures
    const updatedUser = data.user || data; // if backend wraps in 'user' object

    // ✅ Update parent state
    if (setUser) setUser(updatedUser);

    // ✅ Update localStorage so page reload keeps it
    localStorage.setItem("user", JSON.stringify(updatedUser));

   if (setNotification) {
  setNotification({
    type: "success",
    message: "Profile updated successfully!",
    duration: 4000,
  });
}


    onClose();
  } catch (err) {
    console.error(err);
    alert("Error updating profile.");
  } finally {
    setIsSubmitting(false);
  }
};



  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={(e) => e.target.className === "modal-overlay" && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          width: "400px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>Edit Profile</h3>

        <div>
          <label>Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <div>
          <label>Email *</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <div>
          <label>Password (Leave blank to keep current)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              background: "#0052CC",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
