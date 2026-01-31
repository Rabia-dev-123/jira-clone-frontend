// BoardCard.js - Fixed design
import "./BoardCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// BoardCard.js - Fixed with proper alert
// BoardCard.js - Optional: Add board ID display
export default function BoardCard({ board, handleDelete, setNotification }) {
  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete board "${board.title}"?`)) {
      if (setNotification) {
        setNotification({
          type: "error",
          message: `Board "${board.title}" deleted successfully!`
        });
      }
      handleDelete(board.id);
    }
  };
  const columnName = board.columns && board.columns[0] ? board.columns[0].title : "To Do";
  return (
    <div className="board-card">
      <div className="board-header">
        <h3>{board.title}</h3>
        <button className="delete-btn" onClick={handleDeleteClick} title="Delete board">
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </button>
      </div>

      {/* Optional: Add board ID */}
      <div className="board-meta">
        <span className="board-id">ID: {board.id}</span>
        <span>Admin</span>
      </div>

      <div className="board-column">
        <span className="column-label">Column</span>
        <span className="column-value">{columnName}</span>
      </div>
    </div>
  );
}