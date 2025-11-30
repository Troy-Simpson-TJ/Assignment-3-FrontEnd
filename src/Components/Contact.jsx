import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/authContext";

function Contact() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [contacts, setContacts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
   email: "",
    message: "",
  });

  // Load contacts
  useEffect(() => {
    if (!user) return;

    // FIXED: spelling corrected (getContacts)
    api
      .getContacts()
      .then((data) => setContacts(data))
      .catch(() => setStatus("Not able to load contacts."));
  }, [user]);

  // Handle create form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create new contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await api.createContact(form);
      setStatus("Message Sent!");

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    }
  };

  // Start editing an existing contact
  const startEdit = (c) => {
    setEditId(c._id);
    setEditForm({
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone || "",
      email: c.email,
      message: c.message,
    });
  };

  // Save edited contact
  const saveEdit = async (e) => {
    e.preventDefault();

    try {
      const updated = await api.updateContact(editId, editForm);

      setContacts((prev) =>
        prev.map((p) => (p._id === editId ? updated : p))
      );

      setStatus("Contact updated.");
      setEditId(null);

      setEditForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setStatus("Could not update contact.");
    }
  };

  // Delete contact
  const removeContact = async (id) => {
    if (!window.confirm("Delete contact?")) return;

    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setStatus("Could not delete contact.");
    }
  };

  return (
    <div className="page contact">
      <h2>Contact Me</h2>

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

          <div>
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
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit">Send Message</button>
      </form>

      <h3>Manage Contacts</h3>

      {contacts.map((c) => (
        <div key={c._id}>
          <h5>
            {c.firstName} {c.lastName}
          </h5>

          <p>
            <strong>Email:</strong> {c.email}
          </p>
          <p>
            <strong>Phone:</strong> {c.phone || "N/A"}
          </p>
          <p>
            <strong>Message:</strong> {c.message}
          </p>

          <div className="d-flex gap-2">
            <button onClick={() => startEdit(c)}>Edit</button>
            <button onClick={() => removeContact(c._id)}>Delete</button>
          </div>
        </div>
      ))}

      {editId && (
        <form onSubmit={saveEdit}>
          <h4>Edit Contact</h4>

          <input
            name="firstName"
            placeholder="First Name"
            value={editForm.firstName}
            onChange={(e) =>
              setEditForm({ ...editForm, firstName: e.target.value })
            }
            required
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={editForm.lastName}
            onChange={(e) =>
              setEditForm({ ...editForm, lastName: e.target.value })
            }
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={editForm.phone}
            onChange={(e) =>
              setEditForm({ ...editForm, phone: e.target.value })
            }
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
          />

          <textarea
            name="message"
            rows="3"
            placeholder="Message"
            value={editForm.message}
            onChange={(e) =>
              setEditForm({ ...editForm, message: e.target.value })
            }
          />

          <button>Save Changes</button>
        </form>
      )}

      {status && <p>{status}</p>}
    </div>
  );
}

export default Contact;
