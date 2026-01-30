import React from "react";
import "./UserFilterSidebar.css";

export default function UserFilterSidebar({
  isOpen = true,
  users = [],
  selectedUserId,
  onSelectUser,
  onClearFilter
}) {
  // Function to count tasks for each user
  const getUserTaskCount = (userId) => {
    // This would need to be implemented based on your data structure
    // For now, returning 0 - you'll need to calculate this from your boards data
    return 0;
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`user-filter-sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="user-filter-sidebar-content">
        <div className="sidebar-title">
          <span>Filter by Assignee</span>
        </div>

        <div className="users-list">
          {/* "All Users" option */}
          <div
            className={`filter-all-users ${selectedUserId === null ? 'selected' : ''}`}
            onClick={() => onSelectUser(null)}
          >
            <div className="all-users-icon">
              👥
            </div>
            <div className="user-info">
              <div className="user-name">All Users</div>
              <div className="user-email">Show all tasks</div>
            </div>
          </div>

          {/* List of users */}
          {users.map((user) => (
            <div
              key={user.id}
              className={`user-filter-item ${selectedUserId === user.id ? 'selected' : ''}`}
              onClick={() => onSelectUser(user.id)}
            >
              <div className="user-avatar">
                {getInitials(user.name)}
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email || user.username}</div>
              </div>
              <span className="task-count">
                {getUserTaskCount(user.id)}
              </span>
            </div>
          ))}
        </div>

        {selectedUserId !== null && (
          <div className="sidebar-footer">
            <button 
              className="clear-filter-btn"
              onClick={onClearFilter}
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}