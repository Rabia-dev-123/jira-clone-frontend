import React, { useEffect, useState } from "react";
import { fetchTasks, createTask } from  "../api/api";

function TaskColumn({ column, boardId }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const res = await fetchTasks(boardId, column.id);
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, [column]);

  const handleCreateTask = async () => {
    const title = prompt("Task title");
    if (title) {
      await createTask(boardId, column.id, { title });
      loadTasks();
    }
  };

  return (
    <div style={{ width: "250px", background: "#e2e4e6", borderRadius: "6px", padding: "10px" }}>
      <h3>{column.title}</h3>
      <div>
        {tasks.map(task => (
          <div key={task.id} style={{ background: "white", padding: "8px", borderRadius: "4px", marginTop: "8px" }}>
            {task.title}
          </div>
        ))}
      </div>
      <button onClick={handleCreateTask} style={{ marginTop: "10px" }}>+ Add Task</button>
    </div>
  );
}

export default TaskColumn;
