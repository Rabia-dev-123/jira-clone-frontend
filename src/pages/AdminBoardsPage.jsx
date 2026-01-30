import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BoardCard from "../components/BoardCard";
import CreateBoardCard from "../components/CreateBoardCard";
import UsersTable from "../components/UsersTable";
import "./AdminBoardsPage.css";

function AdminBoardsPage({setNotification}) {
  const [view, setView] = useState("boards");
  const [boards, setBoards] = useState([]);
  const createRef = useRef(null);

  // Fetch boards on component mount
  useEffect(() => {
    fetchBoards();
  }, []);

  // Auto scroll when Create Board wraps
  useEffect(() => {
    if (view !== "boards") return;

    const el = createRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isBelowViewport = rect.bottom > window.innerHeight;

    if (isBelowViewport) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [boards.length, view]);

  const fetchBoards = async () => {
    try {
      const response = await fetch("https://jira-rails-backend-production.up.railway.app/api/v1/boards");
      const data = await response.json();
      
      // Check if data is an array
      if (Array.isArray(data)) {
        setBoards(data);
      } else if (data.boards && Array.isArray(data.boards)) {
        // If response is { boards: [...] }
        setBoards(data.boards);
      } else if (data.data && Array.isArray(data.data)) {
        // If response is { data: [...] }
        setBoards(data.data);
      } else {
        console.error("Unexpected API response format:", data);
        setBoards([]);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
      setBoards([]);
    }
  };

const addBoard = async (newBoard) => {
    const payload = { 
      board: {
        title: newBoard.title
      },
      column_title: newBoard.column_title || newBoard.column || "To Do"
    };
    
    try {
      const response = await fetch("https://jira-rails-backend-production.up.railway.app/api/v1/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const savedBoard = await response.json();
        // Update state
        setBoards(prev => [...prev, savedBoard]);
        
        // Show success notification
        if (setNotification) {
          setNotification({
            type: "success",
            message: "Board created successfully!"
          });
        }
      } else {
        const error = await response.text();
        console.error("Failed to create board:", error);
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

// In AdminBoardsPage.js - Update removeBoard function
const removeBoard = async (boardId) => {
  try {
    console.log(`🔄 Deleting board ${boardId} from backend...`);
    
    const response = await fetch(`https://jira-rails-backend-production.up.railway.app/api/v1/boards/${boardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      console.log(`✅ Board ${boardId} deleted from backend`);
      
      // Update frontend state AFTER successful backend deletion
      setBoards(prev => prev.filter(b => b.id !== boardId));
      
      // Show success notification
      if (setNotification) {
        const deletedBoard = boards.find(b => b.id === boardId);
        setNotification({
          type: "error",
          message: `Board "${deletedBoard?.title || 'Board'}" deleted successfully!`
        });
      }
    } else {
      const error = await response.text();
      console.error("❌ Failed to delete board from backend:", error);
      
      // Show error notification
      if (setNotification) {
        setNotification({
          type: "error",
          message: `Failed to delete board: ${error}`
        });
      }
    }
  } catch (error) {
    console.error("❌ Error deleting board:", error);
    
    if (setNotification) {
      setNotification({
        type: "error",
        message: "Error deleting board. Please try again."
      });
    }
  }
};

  // In AdminBoardsPage.js - Update the Sidebar usage
return (
  <div className="admin-page">
    <Sidebar setView={setView} setNotification={setNotification} />
    
    <div className="boards-area">
      {view === "boards" && (
        <>
          {Array.isArray(boards) && boards.map(board => (
            <BoardCard
              key={board.id}
              board={board}
              handleDelete={removeBoard}
              setNotification={setNotification}
            />
          ))}

          <div ref={createRef}>
            <CreateBoardCard onCreate={addBoard} />
          </div>
        </>
      )}

      {view === "users" && <UsersTable />}
    </div>
  </div>
);
}

export default AdminBoardsPage;