import { useState } from "react";
import CreateBoardCard from "../components/CreateBoardCard";
import BoardCard from "../components/BoardCard";
import "./BoardsPage.css";

export default function BoardsPage() {
  const [boards, setBoards] = useState([]);

  // Create a new board
  const handleCreateBoard = (data) => {
    const newBoard = {
      id: Date.now(), // unique id
      title: data.title,
      column: data.column,
    };

    setBoards((prev) => [...prev, newBoard]); // add at the end
  };

  // Delete a specific board
  const handleDelete = (id) => {
    setBoards((prev) => prev.filter((board) => board.id !== id));
  };

  return (
    <div
      className="boards-grid"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          handleDelete={handleDelete} // ✅ match prop name
        />
      ))}

      <CreateBoardCard onCreate={handleCreateBoard} />
    </div>
  );
}
