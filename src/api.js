const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.error("VITE_API_BASE is MISSING. Check Render environment variables.");
}
console.log("API BASE FROM ENV:", import.meta.env.VITE_API_BASE);

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
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // USERS
  getUsers: () => request("/api/users"),
  getUser: (id) => request(`/api/users/${id}`),
  createUser: (data) =>
    request("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUser: (id, data) =>
    request(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    request(`/api/users/${id}`, {
      method: "DELETE",
    }),

  // PROJECTS
  getProjects: () => request("/api/projects"),
  createProject: (data) =>
    request("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id, data) =>
    request(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id) =>
    request(`/api/projects/${id}`, {
      method: "DELETE",
    }),

  // SERVICES
  getServices: () => request("/api/services"),
  createService: (data) =>
    request("/api/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateService: (id, data) =>
    request(`/api/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteService: (id) =>
    request(`/api/services/${id}`, {
      method: "DELETE",
    }),

  // CONTACTS
  getContacts: () => request("/api/contacts"),
  createContact: (data) =>
    request("/api/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateContact: (id, data) =>
    request(`/api/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteContact: (id) =>
    request(`/api/contacts/${id}`, {
      method: "DELETE",
    }),
};

export default api;
