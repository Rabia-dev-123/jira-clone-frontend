import React, { useState, useEffect } from "react";
import "./CreateTaskModal.css";

export default function CreateTaskModal({ open, onClose, users = [], boards = [], onCreate, setNotification }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  
  // Error states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset modal whenever it opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setSelectedUser("");
      setSelectedBoard("");
      setColumns([]);
      setSelectedColumn("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  // Fetch columns when board changes
  useEffect(() => {
    if (selectedBoard) {
      fetch(`https://jira-rails-backend-production.up.railway.app/api/v1/boards/${selectedBoard}/columns`)
        .then(res => res.json())
        .then(data => setColumns(data))
        .catch(err => console.error("Failed to fetch columns:", err));
    } else {
      setColumns([]);
      setSelectedColumn("");
    }
  }, [selectedBoard]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!selectedUser) {
      newErrors.user = "Please assign a user";
    }
    
    if (!selectedBoard) {
      newErrors.board = "Please select a board";
    }
    
    if (!selectedColumn) {
      newErrors.column = "Please select a column";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      user_id: selectedUser,
      board_id: selectedBoard,
      column_id: selectedColumn
    };

    console.log("Creating task:", newTask);

    try {
      // Call parent's create function
      onCreate(newTask);
      
      // Show success notification
      if (setNotification) {
        setNotification({
          type: "success",
          message: "Task created successfully!"
        });
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error("Error creating task:", error);
      setErrors({ submit: "Failed to create task. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create Task</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Show general error at top */}
        {errors.submit && (
          <div className="modal-error">
            {errors.submit}
          </div>
        )}

        <div className="modal-body">
          {/* Title field */}
          <div>
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
              }}
              placeholder="Enter task title"
              className={errors.title ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          {/* Description field */}
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter task description"
              disabled={isSubmitting}
            />
          </div>

          {/* Board field */}
          <div>
            <label>Select Board *</label>
            <select
              value={selectedBoard}
              onChange={e => {
                setSelectedBoard(e.target.value);
                if (errors.board) setErrors(prev => ({ ...prev, board: "" }));
              }}
              className={errors.board ? 'error' : ''}
              disabled={isSubmitting}
            >
              <option value="">Select board</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>{board.title}</option>
              ))}
            </select>
            {errors.board && <div className="error-message">{errors.board}</div>}
          </div>

          {/* Column field */}
          <div>
            <label>Select Column *</label>
            <select
              value={selectedColumn}
              onChange={e => {
                setSelectedColumn(e.target.value);
                if (errors.column) setErrors(prev => ({ ...prev, column: "" }));
              }}
              disabled={!columns.length || isSubmitting}
              className={errors.column ? 'error' : ''}
            >
              <option value="">{columns.length ? "Select column" : "Select a board first"}</option>
              {columns.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
            {errors.column && <div className="error-message">{errors.column}</div>}
          </div>

          {/* User field */}
          <div>
            <label>Assign User *</label>
            <select
              value={selectedUser}
              onChange={e => {
                setSelectedUser(e.target.value);
                if (errors.user) setErrors(prev => ({ ...prev, user: "" }));
              }}
              className={errors.user ? 'error' : ''}
              disabled={isSubmitting}
            >
              <option value="">Select user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            {errors.user && <div className="error-message">{errors.user}</div>}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="create-btn" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}