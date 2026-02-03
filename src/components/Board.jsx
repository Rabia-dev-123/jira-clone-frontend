import React, { useState } from "react";
import TaskCard from "./TaskCard";
import "./Board.css";

export default function Board({ board, searchText, filterUserId, onTaskDrop }) {
  // Each board has only ONE column (based on admin creation)
  const column = board.columns[0];
  const [isDragOver, setIsDragOver] = useState(false);
  
  if (!column) {
    return (
      <div className="board-card" data-status="empty">
        <div className="board-header">
          <h3 className="board-title">{board.title}</h3>
          <span className="board-status">No Column</span>
        </div>
        <div className="board-content">
          <div className="empty-board">No column configured</div>
        </div>
      </div>
    );
  }

  const tasks = column.tasks || [];
  
  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;
    
    const matchesTitle = task.title?.toLowerCase().includes(searchText?.toLowerCase() || "");
    const matchesUser = filterUserId ? task.user_id?.toString() === filterUserId.toString() : true;
    
    return matchesTitle && matchesUser;
  });

  // Determine status from column title
  const getStatusType = () => {
    const title = column.title.toLowerCase();
    if (title.includes('todo') || title.includes('to do')) return 'todo';
    if (title.includes('progress') || title.includes('in progress')) return 'inprogress';
    if (title.includes('done')) return 'done';
    return 'other';
  };

  const status = getStatusType();
  const statusText = column.title;

  // Handle drag over - MUST call preventDefault()
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
    return false;
  };

  // Handle drag enter
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only remove drag-over if leaving the board element (not entering a child)
    const relatedTarget = e.relatedTarget;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsDragOver(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
      
      if (!dragData || !dragData.taskId || !dragData.columnId) {
        console.error("Invalid drag data");
        return;
      }

      // If dropping on same board/column, do nothing
      if (parseInt(dragData.columnId) === column.id) {
        console.log("Dropping on same column, ignoring");
        return;
      }

      console.log("Dropping task:", {
        taskId: dragData.taskId,
        fromColumn: dragData.columnId,
        toColumn: column.id,
        fromBoard: dragData.boardId,
        toBoard: board.id
      });

      // Call parent handler to update task
      if (onTaskDrop) {
        onTaskDrop({
          taskId: parseInt(dragData.taskId),
          sourceColumnId: parseInt(dragData.columnId),
          sourceBoardId: parseInt(dragData.boardId),
          targetColumnId: column.id,
          targetBoardId: board.id
        });
      }
    } catch (error) {
      console.error("Error parsing drag data:", error);
    }
    
    return false;
  };

  return (
    <div 
      className={`board-card ${isDragOver ? 'drag-over' : ''}`}
      data-status={status}
      data-board-id={board.id}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="board-header">
        <h3 className="board-title">{statusText}</h3>
        <div className="board-info">
          <span className="board-status">{filteredTasks.length} tasks</span>
          {/* <span className="task-count">{filteredTasks.length} tasks</span> */}
        </div>
      </div>
      
      <div className="board-content">
        <div className="board-tasks">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
              />
            ))
          ) : (
            <div className="empty-board">
              {searchText || filterUserId ? "No matching tasks" : "Drag tasks here"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}