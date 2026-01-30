import axios from "axios";

const API = axios.create({
  baseURL: "https://jira-rails-backend-production.up.railway.app/api/v1",
  withCredentials: true, // needed for session cookies
});

// ================= AUTH =================
// api.js - Update signupUser function
// api.js
export const signupUser = async (userData) => {
  try {
    const response = await fetch('https://jira-rails-backend-production.up.railway.app/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user: userData  // Rails expects nested user object
      }),
      credentials: 'include' // Important for sessions
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};
export const loginUser = (data) => API.post("/login", data);
export const fetchCurrentUser = () => API.get("/current_user");

// ================= BOARDS =================
export const fetchBoards = () => API.get("/boards");
export const createBoard = (data) => API.post("/boards", { board: data });
export const deleteBoard = (boardId) => API.delete(`/boards/${boardId}`);

// ================= COLUMNS =================
export const fetchColumns = (boardId) =>
  API.get(`/boards/${boardId}/columns`);
export const createColumn = (boardId, data) =>
  API.post(`/boards/${boardId}/columns`, { column: data });
export const deleteColumn = (boardId, columnId) =>
  API.delete(`/boards/${boardId}/columns/${columnId}`);

// ================= TASKS =================
export const fetchTasks = (boardId, columnId) =>
  API.get(`/boards/${boardId}/columns/${columnId}/tasks`);

export const createTask = (boardId, columnId, data) =>
  API.post(`/boards/${boardId}/columns/${columnId}/tasks`, { task: data });

export const updateTask = (boardId, columnId, taskId, data) =>
  API.patch(
    `/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
    { task: data }
  );

export const deleteTask = (boardId, columnId, taskId) =>
  API.delete(`/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);

// ================= ADMIN =================
export const fetchAdminData = () => API.get("/admin");

// ================= USERS =================
export const fetchUsers = () => API.get("/users"); // added
export const updateUserRole = (userId, role) =>
  API.patch(`/users/${userId}`, { user: { role } });

export default API;
