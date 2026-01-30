import React, { useState } from "react";
import "./CreateBoardCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CreateBoardCard({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [column, setColumn] = useState("To Do");

// In CreateBoardCard.js - handleCreate function
// In CreateBoardCard.js
// In CreateBoardCard.js - Update handleCreate function
const handleCreate = () => {
  if (!title.trim()) {
    alert("Please enter a board title");
    return;
  }

  console.log("CreateBoardCard - Creating board:", { title, column });

  // Set board creation notification flag
  localStorage.setItem('showBoardCreatedMessage', 'true');
  
  // Send to parent
  onCreate({ 
    title: title,
    column: column,
    column_title: column
  });

  setTitle("");
  setColumn("To Do");
  setOpen(false);
};

  return (
    <div className="board-card">
      {!open ? (
        <button className="create-placeholder" onClick={() => setOpen(true)}>
          + Create board
        </button>
      ) : (
        <>
          <div className="create-form-top">
            <input
              type="text"
              placeholder="Board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select value={column} onChange={(e) => setColumn(e.target.value)}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <button className="delete-icon" onClick={() =>{ setOpen(false);
               setTitle("");      // reset title
    setColumn("To Do"); // reset column
    }
            }>
              <FontAwesomeIcon icon={faTrash} color="#6b778c" size="lg" />
            </button>
          </div>

          <button className="create-btn" onClick={handleCreate}>
            Create
          </button>
        </>
      )}
    </div>
  );
}
