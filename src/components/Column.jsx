import React from "react";
import TaskCard from "./TaskCard";
import "./Column.css";

export default function Column({ column, boardId, searchText, filterUserId, columnType = "default" }) {
  // Ensure tasks is always an array
  const tasks = column.tasks || [];
  
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;
    
    // Filter by search text
    const matchesTitle = task.title?.toLowerCase().includes(searchText?.toLowerCase() || "");
    
    // Filter by user if filterUserId is set
    const matchesUser = filterUserId ? task.user_id?.toString() === filterUserId.toString() : true;
    
    // Also check task.user.id if it exists
    const matchesUserObject = filterUserId ? 
      (task.user?.id?.toString() === filterUserId.toString()) : true;
    
    return matchesTitle && (matchesUser || matchesUserObject);
  });

  return (
    <div className="column" data-column-type={columnType}>
      <div className="column-header">
        <h4 className="column-title">{column.title}</h4>
        <span className="task-count">{filteredTasks.length}</span>
      </div>
      
      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              boardId={boardId} 
              columnId={column.id} 
            />
          ))
        ) : (
          <div className="empty-column">
            {searchText || filterUserId ? "No matching tasks" : "No tasks"}
          </div>
        )}
      </div>
    </div>
  );
}