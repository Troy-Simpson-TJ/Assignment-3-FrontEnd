
const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  // AUTH
  signup: (data) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // USERS
  getUsers: () => request("/users"),
  getUser: (id) => request(`/users/${id}`),
  createUser: (data) =>
    request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (id, data) =>
    request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    request(`/users/${id}`, {
      method: "DELETE",
    }),

  // PROJECTS
  getProjects: () => request("/projects"),
  createProject: (data) =>
    request("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id, data) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id) =>
    request(`/projects/${id}`, {
      method: "DELETE",
    }),

  // SERVICES
  getServices: () => request("/services"),
  createService: (data) =>
    request("/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id, data) =>
    request(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteService: (id) =>
    request(`/services/${id}`, {
      method: "DELETE",
    }),

  // CONTACTS
  getContacts: () => request("/contacts"),
  createContact: (data) =>
    request("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateContact: (id, data) =>
    request(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteContact: (id) =>
    request(`/contacts/${id}`, {
      method: "DELETE",
    }),
};

export default api;
