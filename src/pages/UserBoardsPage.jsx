import React, { useState, useEffect,  } from "react";
import Header from "../components/Header";
import BoardsGrid from "../components/BoardsGrid";
import CreateTaskModal from "../components/CreateTaskModal";
import "./UserBoardsPage.css";

export default function UserBoardsPage({setNotification }) {
  const [searchText, setSearchText] = useState("");
  const [boards, setBoards] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterUserId, setFilterUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      const hasSeenWelcome = sessionStorage.getItem('hasSeenBoardWelcome');
    if (!hasSeenWelcome && setNotification) {
      setTimeout(() => {
        setNotification({
          type: "info",
          message: "Welcome to your boards! Here you can manage all your tasks."
        });
        sessionStorage.setItem('hasSeenBoardWelcome', 'true');
      }, 500); // Small delay to ensure page loads
    }

    fetchData();
      const handleDragStart = (e) => {
    console.log("Global drag start:", e.dataTransfer.getData("text/plain"));
  };
  
  const handleDragEnd = (e) => {
    console.log("Global drag end");
  };
  
  const handleDrop = (e) => {
    console.log("Global drop:", e.dataTransfer.getData("text/plain"));
  };

  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragend', handleDragEnd);
  document.addEventListener('drop', handleDrop);

  return () => {
    document.removeEventListener('dragstart', handleDragStart);
    document.removeEventListener('dragend', handleDragEnd);
    document.removeEventListener('drop', handleDrop);
  };

  },  [setNotification]);;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch boards
      const resBoards = await fetch("https://web-production-45cea.up.railway.app/api/v1/boards");
      const boardsData = await resBoards.json();

      // Fetch users
      const usersRes = await fetch("https://web-production-45cea.up.railway.app/api/v1/users");
      const usersData = await usersRes.json();
      setUsers(usersData);

      // For each board, fetch its single column and tasks
      const boardsWithColumns = await Promise.all(
        boardsData.map(async (board) => {
          // Fetch columns for this board
          const resCols = await fetch(
            `https://web-production-45cea.up.railway.app/api/v1/boards/${board.id}/columns`
          );
          const colsData = await resCols.json();
          
          // Each board has only ONE column (based on admin creation)
          const column = colsData[0] || null;
          
          if (column) {
            // Fetch tasks for this column
            const resTasks = await fetch(
              `https://web-production-45cea.up.railway.app/api/v1/boards/${board.id}/columns/${column.id}/tasks`
            );
            const tasksData = await resTasks.json();
            
            // Attach user data to each task
          const tasksWithUsers = tasksData.map(task => {
  const user = usersData.find(u => u.id === task.user_id);
  return { 
    ...task, 
    user: user || null,
    board_id: board.id // ← ADD THIS LINE - CRITICAL!
    
  };
  
});
            console.log("Sample task:", tasksWithUsers[0]);
            return {
              ...board,
              columns: [{ ...column, tasks: tasksWithUsers }]
            };
          }
          
          return { ...board, columns: [] };
        })
      );

      setBoards(boardsWithColumns);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

// In UserBoardsPage.js - Update handleCreateTask function
const handleCreateTask = (taskData) => {
  fetch(
    `https://web-production-45cea.up.railway.app/api/v1/boards/${taskData.board_id}/columns/${taskData.column_id}/tasks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: taskData }),
    }
  )
    .then((res) => res.json())
    .then((newTask) => {
      const assignedUser = users.find((u) => u.id === newTask.user_id) || null;
      const taskWithUser = { ...newTask, user: assignedUser };

      // Update the specific board's single column
      setBoards((prevBoards) =>
        prevBoards.map((board) => {
          if (board.id.toString() !== taskData.board_id.toString()) return board;
          
          const updatedColumn = {
            ...board.columns[0],
            tasks: [...board.columns[0].tasks, taskWithUser]
          };
          
          return { ...board, columns: [updatedColumn] };
        })
      );

      // Show success notification
      if (setNotification) {
        setNotification({
          type: "success",
          message: "Task created successfully!"
        });
      }

      setModalOpen(false);
    })
    .catch((err) => {
      console.error("Error creating task:", err);
      // Show error notification
      if (setNotification) {
        setNotification({
          type: "error",
          message: "Failed to create task. Please try again."
        });
      }
    });
};

  // Handle task drop between boards
const handleTaskDrop = async (dropData) => {
  let { taskId, sourceColumnId, targetColumnId, sourceBoardId, targetBoardId } = dropData;
  
  console.log("Moving task:", {
    taskId,
    fromBoard: sourceBoardId,
    toBoard: targetBoardId,
    fromColumn: sourceColumnId,
    toColumn: targetColumnId
  });
  
  try {
    // Use the standard update endpoint for ALL moves (both same board and different board)
    // IMPORTANT: Use the CURRENT board where the task is located
    const currentBoardId = sourceBoardId;
    
    const response = await fetch(
      `https://web-production-45cea.up.railway.app/api/v1/boards/${currentBoardId}/columns/${sourceColumnId}/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          task: { 
            column_id: targetColumnId
          } 
        }),
      }
    );

    console.log("API response status:", response.status);
    
    // Handle empty response
    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      // If response is empty but status is 200, assume success
      if (response.ok) {
        result = { id: taskId, column_id: targetColumnId };
      } else {
        throw new Error("Empty response from server");
      }
    }
    
    console.log("API response body:", result);
    
    if (response.ok) {
      console.log("✅ Task moved successfully:", result);
      
      // Update local state
      setBoards(prevBoards => {
        const newBoards = [...prevBoards];
        
        // 1. Remove task from source board
        const sourceBoardIndex = newBoards.findIndex(b => b.id === sourceBoardId);
        if (sourceBoardIndex !== -1 && newBoards[sourceBoardIndex].columns[0]) {
          newBoards[sourceBoardIndex] = {
            ...newBoards[sourceBoardIndex],
            columns: [{
              ...newBoards[sourceBoardIndex].columns[0],
              tasks: newBoards[sourceBoardIndex].columns[0].tasks.filter(t => t.id !== taskId)
            }]
          };
        }
        
        // 2. Add task to target board
        const targetBoardIndex = newBoards.findIndex(b => b.id === targetBoardId);
        if (targetBoardIndex !== -1 && newBoards[targetBoardIndex].columns[0]) {
          // Find the task in original source to preserve its data
          const originalSourceBoard = prevBoards.find(b => b.id === sourceBoardId);
          const originalTask = originalSourceBoard?.columns[0]?.tasks.find(t => t.id === taskId);
          
          const updatedTask = {
            ...originalTask,
            ...result,
            board_id: targetBoardId, // Update board_id
            column_id: targetColumnId, // Update column_id
            user: result.user || originalTask?.user || null
          };
          
          newBoards[targetBoardIndex] = {
            ...newBoards[targetBoardIndex],
            columns: [{
              ...newBoards[targetBoardIndex].columns[0],
              tasks: [...newBoards[targetBoardIndex].columns[0].tasks, updatedTask]
            }]
          };
        }
        
        return newBoards;
      });
      
      console.log("✅ Local state updated");
    } else {
      console.error("❌ Failed to move task. Error details:", result);
      
      if (result.errors && result.errors.length > 0) {
        alert(`Cannot move task: ${result.errors.join(", ")}`);
      }
    }
  } catch (error) {
    console.error("❌ Error moving task:", error);
    alert(`Error moving task: ${error.message}`);
  }
};
  const handleClearFilter = () => {
    setFilterUserId(null);
  };

  return (
    <div className="user-boards-container">
      <Header
        onOpenCreate={() => setModalOpen(true)}
        onSearch={setSearchText}
      />

      {/* Fixed filter controls */}
  <div className="fixed-filter-controls">
  <div className="filter-controls-bar">
    {/* Search bar */}
    <div className="board-search-container">
      <i className="fas fa-search search-icon-gray"></i>
      <input
        type="text"
        placeholder="Search boards..."
        className="board-search-input"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>

          {/* User filter - horizontal scroll */}
{/* User filter - horizontal scroll */}
<div className="users-filter-wrapper">
  <div className="users-filter-container">
    {users.map((user, index) => {
      // Color palette for user icons
      const colors = [
        '#0052CC', '#00A3BF', '#36B37E', '#FF5630', 
        '#FFAB00', '#6554C0', '#00B8D9', '#FF8B00',
        '#006644', '#5243AA', '#E34935', '#008DA6'
      ];
      const color = colors[index % colors.length];
      
      return (
        <div
          key={user.id}
          className={`user-filter-icon ${filterUserId === user.id ? 'selected' : ''}`}
          onClick={() => setFilterUserId(user.id)}
          title={user.name}
          style={{ '--user-color': color }}
        >
          <div className="icon-avatar">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      );
    })}
  </div>
</div>

          {/* Clear filter button */}
      {filterUserId !== null && (
      <button className="clear-filter-btn-right" onClick={handleClearFilter}>
        Clear Filter
      </button>
    )}
  </div>

        {/* Active filter info */}
       {/* {filterUserId && (
    <div className="active-filter-info-wrapper">
      <div className="active-filter-info">
        <div className="active-filter-content">
          <span>
            Showing tasks assigned to:{" "}
            <strong>{users.find(u => u.id === filterUserId)?.name}</strong>
          </span>
          <button onClick={handleClearFilter} className="clear-filter-btn-inline">
            ✕
          </button>
        </div>
      </div>
    </div>
  )} */}
</div>

      {/* Main boards area */}
      <div className="boards-main-area">
        {isLoading ? (
          <div className="loading-message">Loading boards...</div>
        ) : (
          <BoardsGrid 
            boards={boards} 
            searchText={searchText}
            filterUserId={filterUserId}
            onTaskDrop={handleTaskDrop}
            fetchBoards={fetchData}
          />
        )}
      </div>

  
<CreateTaskModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  boards={boards}
  users={users}
  onCreate={handleCreateTask}
  setNotification={setNotification} // Add this line
/>
    </div>
  );
}