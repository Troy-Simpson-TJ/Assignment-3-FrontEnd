const _rawBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_APP_APIURL || "";
const API_BASE = _rawBase.replace(/\/$/, "");

async function request(path, options = {}) {
  if (!API_BASE) {
    throw new Error(
      "API base URL is not configured. Set `VITE_API_BASE` (or `VITE_APP_APIURL`) in your .env and restart the dev server."
    );
  }

  const url = API_BASE + (path.startsWith("/") ? path : `/${path}`);

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // AUTH
  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  signup: (data) =>
    request("/auth/signup", {
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