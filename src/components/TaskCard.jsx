import React from "react";
import "./TaskCard.css";

export default function TaskCard({ task }) {
  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to generate consistent color based on user ID
  const getUserColor = (userId) => {
    const colors = [
      '#0052CC', '#6554C0', '#00B8D9', '#36B37E', 
      '#FF5630', '#FFAB00', '#5243AA', '#00875A'
    ];
    return colors[(userId || 0) % colors.length];
  };

  // Generate a simple task ID
  const taskId = `TASK-${task.id?.toString().padStart(3, '0') || '000'}`;

  const handleDragStart = (e) => {
    // Set drag data
    e.dataTransfer.setData("text/plain", JSON.stringify({
      taskId: task.id,
      columnId: task.column_id,
      boardId: task.board_id
    }));
    
    // Add visual feedback
    e.currentTarget.classList.add("dragging");
    
    // Set drag image to the element itself
    e.dataTransfer.effectAllowed = "move";
    
    // Optional: Set a custom drag image
    // e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
  };

  return (
    <div 
      className="task-card"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-task-id={task.id}
    >
      <div className="task-header">
        <h5 className="task-title">{task.title || "Untitled Task"}</h5>
        <div className="task-priority priority-medium"></div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-footer">
        <div className="assigned-user">
          {task.user ? (
            <>
              <div 
                className="user-avatar-small"
                style={{ background: getUserColor(task.user.id) }}
              >
                {getInitials(task.user.name)}
              </div>
              <span className="user-name">{task.user.name}</span>
            </>
          ) : (
            <div className="user-avatar-small" style={{ background: '#DFE1E6', color: '#6B778C' }}>
              ?
            </div>
          )}
        </div>
        
        <div className="task-meta">
          <span className="task-id">{taskId}</span>
        </div>
      </div>
    </div>
  );
}