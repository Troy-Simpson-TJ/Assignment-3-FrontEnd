import { useEffect, useState } from "react";
import ListComponent from "../Components/ListComponent";
import { api } from "../api";
import { useAuth } from "../context/authContext.jsx";
import project1 from "../assets/project1.jpg";
import project2 from "../assets/project2.jpg";
import project3 from "../assets/project3.jpg";

// Default/static projects for display
const defaultProjects = [
  {
    imagePath: project1,
    title: "Protect Yuh Yard",
    text: "This is a 2D game that requires you to defend your base from incoming enemies, developed using Unity and Visual Studio."
  },
  {
    imagePath: project2,
    title: "Black Jack",
    text: "A Web Card game developed using HTML/CSS & JavaScript."
  },
  {
    imagePath: project3,
    title: "General Contractor's Website",
    text: "A website I created for a General Contractor with visually appealing colors and features using my abilities."
  }
];

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [editID, setEditID] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    imagePath: "",
    title: "",
    text: ""
  });

  // Load projects from API on mount
  useEffect(() => {
    api.getProjects()
      .then(data => setProjects(data))
      .catch(() => setMessage("Could not load projects."));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update project
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("You must be logged in to modify projects.");

    try {
      if (editID) {
        const updated = await api.updateProject(editID, form);
        setProjects(prev => prev.map(p => (p._id === editID ? updated : p)));
        setMessage("Project updated.");
      } else {
        const created = await api.createProject(form);
        setProjects(prev => [...prev, created]);
        setMessage("Project added.");
      }
      setForm({ imagePath: "", title: "", text: "" });
      setEditID(null);
    } catch {
      setMessage("Something went wrong.");
    }
  };

  // Start editing a project
  const startEdit = (p) => {
    if (!user) return setMessage("You must be logged in to edit projects.");
    setEditID(p._id);
    setForm({
      imagePath: p.imagePath,
      title: p.title,
      text: p.text
    });
  };

  // Delete a project
  const remove = async (id) => {
    if (!user) return setMessage("You must be logged in to delete projects.");
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      setMessage("Project deleted.");
    } catch {
      setMessage("Could not delete project.");
    }
  };

  return (
    <section className="projects page">
      <h2>My Projects</h2>

      {/* Display static/default projects */}
      <ListComponent items={defaultProjects} />

      <h3>Manage Projects</h3>

      {!user && <p className="text-invalid">Must be logged in to add or modify projects.</p>}

      {user && (
        <form onSubmit={handleSubmit}>
          <input
            name="imagePath"
            placeholder="Image URL"
            value={form.imagePath}
            onChange={handleChange}
          />
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="text"
            placeholder="Description"
            rows="3"
            value={form.text}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {editID ? "Update Project" : "Add Project"}
          </button>
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

      <h4>Saved Projects</h4>
      <div className="saved-projects">
        {projects.map(p => (
          <article key={p._id} className="project-card">
            {p.imagePath && (
              <img
                src={p.imagePath}
                alt={p.title}
                style={{ height: "180px", objectFit: "cover" }}
              />
            )}
            <div className="card-body">
              <h5>{p.title}</h5>
              <p>{p.text}</p>
            </div>
            {user && (
              <footer>
                <button onClick={() => startEdit(p)}>Edit</button>
                <button onClick={() => remove(p._id)}>Delete</button>
              </footer>
            )}
          </article>
        ))}
      </div>

      {message && <p>{message}</p>}
    </section>
  );
}

export default Projects;
