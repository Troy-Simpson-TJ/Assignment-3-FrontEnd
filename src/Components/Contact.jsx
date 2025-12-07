import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.jsx";
import { api } from "../api";

export default function Contact() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [error, setError] = useState(null);

  // ✅ LOAD CONTACTS
  useEffect(() => {
    api.getContacts()
      .then(data => setContacts(data))
      .catch(() => setError("Could not load contacts."));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ✅ SUBMIT CONTACT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createContact(form);
      const updated = await api.getContacts();
      setContacts(updated);

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: ""
      });

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div>
      <h2>Contact Me</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First name"
        />

        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last name"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message"
          rows="5"
        />

        <button type="submit">Send Message</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Saved Contacts</h3>
      <ul>
        {contacts.map(c => (
          <li key={c._id}>
            {c.firstName} {c.lastName} — {c.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
