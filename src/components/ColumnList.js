// import { useEffect, useState } from "react";
// import { fetchColumns, createColumn } from "../api/api";
// import TaskList from "./TaskList";

// const ColumnList = ({ boardId }) => {
//   const [columns, setColumns] = useState([]);
//   const [title, setTitle] = useState("");

//   // Fetch columns for a board
//   const loadColumns = async () => {
//     try {
//       const res = await fetchColumns(boardId);
//       setColumns(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadColumns();
//   }, [boardId]);

//   // Create new column
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (!title) return;

//     try {
//       const res = await createColumn(boardId, { title });
//       setColumns([...columns, res.data]);
//       setTitle("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <h3>Columns</h3>

//       <form onSubmit={handleCreate}>
//         <input
//           type="text"
//           placeholder="New Column Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <button type="submit">Add Column</button>
//       </form>

//      <ul>
//   {columns.map((col) => (
//     <li key={col.id}>
//       <strong>{col.title}</strong>
//      <TaskList boardId={boardId} columnId={col.id} />
//     </li>
//   ))}
// </ul>

//     </div>
//   );
// };

// export default ColumnList;
