import React, { useState, useEffect } from "react";
import "./CreateTaskModal.css";

export default function CreateTaskModal({ open, onClose, users = [], boards = [], onCreate, setNotification }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Error states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset modal whenever it opens
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setSelectedUser("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!selectedUser) newErrors.user = "Please assign a user";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsSubmitting(true);

  // Find the first column with title "To Do"
  let todoBoard = null;
  let todoColumn = null;

  for (const board of boards) {
    const column = board.columns?.find(c => c.title.toLowerCase() === "to do");
    if (column) {
      todoBoard = board;
      todoColumn = column;
      break;
    }
  }

  if (!todoBoard || !todoColumn) {
    setErrors({ submit: 'No "To Do" column found to assign the task.' });
    setIsSubmitting(false);
    return;
  }

  const newTask = {
    title: title.trim(),
    description: description.trim(),
    user_id: selectedUser,
    board_id: todoBoard.id,    // always the board that has "To Do"
    column_id: todoColumn.id,  // always the "To Do" column
  };

  try {
    onCreate(newTask);

    if (setNotification) {
      setNotification({
        type: "success",
        message: "Task created successfully!"
      });
    }

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

        {errors.submit && <div className="modal-error">{errors.submit}</div>}

        <div className="modal-body">
          {/* Title field */}
          <div>
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              disabled={isSubmitting}
            />
          </div>

          {/* User field */}
          <div>
            <label>Assign User *</label>
            <select
              value={selectedUser}
              onChange={(e) => {
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
