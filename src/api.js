// src/api.js
import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api"; // change when deployed

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true // enable only if you're using cookies/auth across origins
});

// Contacts
export const getContacts = async () => {
  const res = await apiClient.get("/contacts");
  return res.data;
};
export const createContact = async (contact) => {
  const res = await apiClient.post("/contacts", contact);
  return res.data;
};

// Projects
export const getProjects = async () => {
  const res = await apiClient.get("/projects");
  return res.data;
};
export const createProject = async (project) => {
  const res = await apiClient.post("/projects", project);
  return res.data;
};
export const deleteProject = async (id) => {
  const res = await apiClient.delete(`/projects/${id}`);
  return res.data;
};

// default export if you want the client directly
export default apiClient;
