import { useEffect, useState } from "react";
import ListComponent from "../Components/ListComponent";
import { api } from "../api";
import { useAuth } from "../context/authContext";
import service1 from "../assets/service1.jpg";
import service2 from "../assets/service2.jpg";
import service3 from "../assets/service3.jpg";

// Default/static services for display
const defaultServices = [
  {
    imagePath: service1,
    title: "Debugging & Redesigning",
    text: "I debug by identifying and fixing errors, and I redesign by improving existing designs for better function and appearance.",
  },
  {
    imagePath: service2,
    title: "UI/UX Design & Web Components",
    text: "I work on UI/UX design by creating user-friendly, visually appealing interfaces, and I build web components that make websites more functional, reusable, and efficient.",
  },
  {
    imagePath: service3,
    title: "Web Design & Game Design",
    text: "I do web design by building attractive, responsive websites, and game design by creating engaging gameplay experiences with thoughtful mechanics and visuals.",
  },
];

function Services() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [editID, setEditID] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    imagePath: "",
    title: "",
    text: "",
  });

  // Load services from API on mount
  useEffect(() => {
    api
      .getServices()
      .then((data) => setServices(data))
      .catch(() => setMessage("Could not load services."));
  }, []);

  // Handle input change for form
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add or update a service
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return setMessage("You must be logged in to modify services.");

    try {
      if (editID) {
        const updated = await api.updateService(editID, form);
        setServices((prev) =>
          prev.map((s) => (s._id === editID ? updated : s))
        );
        setMessage("Service updated.");
      } else {
        const created = await api.createService(form);
        setServices((prev) => [...prev, created]);
        setMessage("Service added.");
      }

      setForm({ imagePath: "", title: "", text: "" });
      setEditID(null);
    } catch {
      setMessage("Something went wrong.");
    }
  };

  // Populate form to edit a service
  const startEdit = (service) => {
    if (!user) return setMessage("You must be logged in to edit services.");
    setEditID(service._id);
    setForm({
      imagePath: service.imagePath,
      title: service.title,
      text: service.text,
    });
  };

  // Delete a service
  const remove = async (id) => {
    if (!user) return setMessage("You must be logged in to delete services.");
    if (!window.confirm("Delete this service?")) return;

    try {
      await api.deleteService(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
      setMessage("Service deleted.");
    } catch {
      setMessage("Could not delete service.");
    }
  };

  return (
    <section className="page services">
      <h2>My Services</h2>

      {/* Static/default services */}
      <ListComponent items={defaultServices} />

      <h3>Manage Services</h3>

      {!user && <p className="text-invalid">Must be logged in to add or modify.</p>}

      {user && (
        <form onSubmit={handleSubmit}>
          <input
            name="imagePath"
            placeholder="IMAGE URL"
            value={form.imagePath}
            onChange={handleChange}
            required
          />
          <input
            name="title"
            type="text"
            placeholder="TITLE"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="text"
            rows={3}
            placeholder="Description"
            value={form.text}
            onChange={handleChange}
            required
          />
          <button type="submit">{editID ? "Update" : "Add Service"}</button>
          {editID && (
            <button
              type="button"
              onClick={() => {
                setEditID(null);
                setForm({ imagePath: "", title: "", text: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <h4>Saved Services</h4>
      <div>
        {services.map((s) => (
          <article key={s._id}>
            <div>
              {s.imagePath && (
                <img src={s.imagePath} alt={s.title} style={{ height: "150px", objectFit: "cover", marginBottom: "10px" }} />
              )}
              <h5>{s.title}</h5>
              <p>{s.text}</p>
              {user && (
                <div>
                  <button onClick={() => startEdit(s)}>Edit</button>
                  <button onClick={() => remove(s._id)}>Delete</button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {message && <p>{message}</p>}
    </section>
  );
}

export default Services;
