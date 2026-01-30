import React, { useEffect, useState } from "react";
import "./UsersTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Fetch users from Rails API
  useEffect(() => {
    setLoading(true);
    fetch("https://jira-rails-backend-production.up.railway.app/api/v1/users") // Changed from /admin to /users
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        // Fallback to admin endpoint if /users doesn't work
        fetch("https://jira-rails-backend-production.up.railway.app/api/v1/admin")
          .then((res) => res.json())
          .then((data) => setUsers(data.users || data))
          .catch((err2) => console.error("Both endpoints failed:", err2));
      })
      .finally(() => setLoading(false));
  }, []);

  // Update user role
  const handleRoleChange = (id, newRole) => {
    setUpdatingUserId(id);
    
    fetch(`https://jira-rails-backend-production.up.railway.app/api/v1/users/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for sessions
      body: JSON.stringify({ user: { role: newRole } }), // Note: nested user object
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to update role: ${res.status}`);
        }
        return res.json();
      })
      .then((updatedUser) => {
        console.log("Updated user:", updatedUser);
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: updatedUser.role || newRole } : u))
        );
        
        // Show success message
        alert(`User role updated to ${newRole}`);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
        alert(`Failed to update role: ${err.message}`);
      })
      .finally(() => {
        setUpdatingUserId(null);
      });
  };

  // Delete user
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    fetch(`https://jira-rails-backend-production.up.railway.app/api/v1/users/${id}`, { 
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to delete user: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Delete response:", data);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert("User deleted successfully");
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        alert(`Failed to delete user: ${err.message}`);
      });
  };

  // Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="users-table-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="users-table-container">
      <h3>All Users</h3>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role || "user"} // Default to "user" if role is undefined
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={updatingUserId === user.id}
                  className="role-select"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {updatingUserId === user.id && (
                  <span className="updating-text">Updating...</span>
                )}
              </td>
              <td className="actions">
                <button 
                  title="Delete" 
                  onClick={() => handleDelete(user.id)}
                  className="delete-btn"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}