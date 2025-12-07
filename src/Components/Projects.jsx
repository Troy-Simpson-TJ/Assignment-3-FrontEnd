import { useEffect, useState } from "react";
import ListComponent from "../Components/ListComponent";
import { getProjects, createProject, deleteProject } from "../api";
import { useAuth } from "../context/authContext.jsx";
import project1 from "../assets/project1.jpg";
import project2 from "../assets/project2.jpg";
import project3 from "../assets/project3.jpg";

const defaultProjects = [
  { imagePath: project1, title: "Protect Yuh Yard", text: "2D Unity defense game." },
  { imagePath: project2, title: "Black Jack", text: "Web Card game using HTML/CSS/JS." },
  { imagePath: project3, title: "General Contractor's Website", text: "Business website project." }
];

function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [editID, setEditID] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ imagePath: "", title: "", text: "" });

  useEffect(() => {
    getProjects()
      .then(data => setProjects(data))
      .catch(() => setMessage("Could not load projects."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("You must be logged in to modify projects.");

    try {
      if (editID) {
        await deleteProject(editID);
        const created = await createProject(form);
        setProjects(prev => prev.map(p => (p._id === editID ? created : p)));
        setMessage("Project updated.");
      } else {
        const created = await createProject(form);
        setProjects(prev => [...prev, created]);
        setMessage("Project added.");
      }

      setForm({ imagePath: "", title: "", text: "" });
      setEditID(null);
    } catch {
      setMessage("Something went wrong.");
    }
  };

  const startEdit = (p) => {
    if (!user) return setMessage("You must be logged in to edit projects.");
    setEditID(p._id);
    setForm({ imagePath: p.imagePath, title: p.title, text: p.text });
  };

  const remove = async (id) => {
    if (!user) return setMessage("You must be logged in to delete projects.");
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      setMessage("Project deleted.");
    } catch {
      setMessage("Could not delete project.");
    }
  };

  return (
    <section className="projects page">
      <h2>My Projects</h2>

      <ListComponent items={defaultProjects} />

      <h3>Manage Projects</h3>
      {!user && <p className="text-invalid">Must be logged in.</p>}

      {user && (
        <form onSubmit={handleSubmit}>
          <input name="imagePath" placeholder="Image URL" value={form.imagePath} onChange={handleChange} />
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <textarea name="text" placeholder="Description" rows="3" value={form.text} onChange={handleChange} required />

          <button type="submit">{editID ? "Update Project" : "Add Project"}</button>
          {editID && (
            <button type="button" onClick={() => {
              setEditID(null);
              setForm({ imagePath: "", title: "", text: "" });
            }}>
              Cancel
            </button>
          )}
        </form>
      )}

      <h4>Saved Projects</h4>
      <div className="saved-projects">
        {projects.map(p => (
          <article key={p._id} className="project-card">
            {p.imagePath && <img src={p.imagePath} alt={p.title} />}
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

