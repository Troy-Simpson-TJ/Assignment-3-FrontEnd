import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import { getContacts, createContact } from "../api";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        console.error("Failed to load contacts:", err);
        setError("Could not load contacts.");
      }
    })();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContact(form);
      // optionally re-fetch contacts
      const updated = await getContacts();
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
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
        <input name="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Last name" />
        <input name="phone"     value={form.phone}     onChange={handleChange} placeholder="Phone" />
        <input name="email"     value={form.email}     onChange={handleChange} placeholder="Email" />
        {/* IMPORTANT: use textarea, not descriptionarea */}
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message"
          rows="5"
        />
        <button type="submit">Send Message</button>
      </form>

      {error && <p style={{color:"red"}}>{error}</p>}

      <h3>Manage Contacts</h3>
      <ul>
        {contacts.map(c => (
          <li key={c._id || c.id}>
            {c.firstName} {c.lastName} — {c.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
