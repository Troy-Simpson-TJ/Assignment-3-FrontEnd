import { useEffect, useState } from "react";
import { api } from "../api";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [editID, seteditID] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "",
  });

  useEffect(() => {
    api
      .getUsers()
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load users.");
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value,});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (editID) {

        const updated = await api.updateUser(editID, form);

        setUsers((prev) =>
          prev.map((u) => (u._id === editID ? updated : u))
        );
        setMessage("User updated.");
      } else {

        const created = await api.createUser(form);
        setUsers((prev) => [...prev, created]);
        setMessage("User added.");
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        role: "",
      });

      seteditID(null);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  const handleEdit = (user) => {
    seteditID(user._id);
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      username: user.username || "",
      role: user.role || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setMessage("User deleted.");
    } catch (err) {
      console.error(err);
      setMessage("Delete failed.");
    }
  };

  return (
    <div className="page users-admin">
      <h2>Manage Users</h2>

      <div>
        <h5>{editID ? "Edit User" : "Add User"}</h5>

        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div >
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            {editID ? "Update User" : "Add User"}
          </button>

          {editID && (
            <button
              type="button"
              onClick={() => {
                seteditID(null);
                setForm({
                  firstName: "",
                  lastName: "",
                  email: "",
                  username: "",
                  role: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <h4>All Users</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th style={{ width: "170px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          )}

          {users.map((u) => (
            <tr key={u._id}>
              <td>
                {u.firstName} {u.lastName}
              </td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button
                  onClick={() => handleEdit(u)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersAdmin;