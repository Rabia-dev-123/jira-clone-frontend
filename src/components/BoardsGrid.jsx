import React from "react";
import Board from "./Board";
import "./BoardsGrid.css";

export default function BoardsGrid({ boards, searchText, filterUserId, onTaskDrop }) {
  // If no boards, show message
  if (!boards || boards.length === 0) {
    return (
      <div className="boards-grid empty">
        <div className="no-boards-message">
          No boards available. Create some boards from the admin panel.
        </div>
      </div>
    );
  }

  return (
    <div className="boards-grid">
      {boards.map((board) => (
        <Board 
          key={board.id} 
          board={board} 
          searchText={searchText}
          filterUserId={filterUserId}
          onTaskDrop={onTaskDrop}
        />
      ))}
    </div>
  );
}