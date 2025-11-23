import ListComponent from "./ListComponent";
import project1 from "../assets/project1.jpg";
import project2 from "../assets/project2.jpg"
import project3 from "../assets/project3.jpg";
import { api } from "../api";
import { useEffect, useState } from "react";
const projects =[
    {
        imagePath: project1,
        title:"Protect Yuh Yard",
        text:"This is a 2D game that requires you to defend your bas from incoming enemies and was developed using Unity and Visual Studio."
    },
    {
        imagePath: project2,
        title:"Black Jack",
        text:"A Web Card game that was developed using HTML/CSS & JavaScript."
    },
    {
        imagePath: project3,
        title:"General Contractor's Website",
        text:" A website I created for a General Contractor with visually appealing colors and features using my abilities."
    },  
];
function Projects(){

  const [projects, setProjects] = useState([]);
  const [editID, setEditingId] = useState(null);
  const [message, setMessage] = useState("");


  const [form, setForm] = useState({
    imagePath: "",
    title: "",
    text: ""
  });

  useEffect(() => {
    api.getProjects()
      .then((data) => setProjects(data))
      .catch(() => setMessage("Could not load projects"));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");  

    try {
        if (editID) {
          const updated = await api.updateProject(editID, form);
          setProjects((prev) =>
            prev.map((p) => (p._id === editID ? updated : p))
          );
          setMsg("Project updated");
        } else {
          const created = await api.createProject(form);
          setProjects((prev) => [...prev, created]);
          setMessage("Project added");
        }
  
        setForm({ imagePath: "", title: "", text: "" });
        setEditingId(null);
  
      } catch (err) {
        setMessage("Something went wrong");
      }
    };
  
    const startEdit = (p) => {
      setEditingId(p._id);
      setForm({
        imagePath: p.imagePath,
        title: p.title,
        text: p.description,
        
      });
    };
  
    const remove = async (id) => {
      if (!window.confirm("Delete this project?")) return;
  
      try {
        await api.deleteProject(id);
        setProjects((prev) => prev.filter((p) => p._id !== id));
        setMessage("Project deleted");
      } catch {
        setMessage("Could not delete project");
      }
    };


    return(
        <section className="projects page">
        <h2>My Projects</h2>
  
    
        <ListComponent items={Projects} />
  
        <h3>Manage Projects</h3>
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
  
          <descriptionarea
            name="description"
            placeholder="Description"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
  
  
          <button className="btn btn-primary">
            {editID ? "Update" : "Add Project"}
          </button>
  
          {editID && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ imagePath: "", title: "", description: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>

        <h4>Saved Projects</h4>

      <div className>
        {projects.map((p) => (
          <article key={p._id}>
            <div >
              {p.imagePath && (
                <img
                  src={p.imagePath}
                  alt={p.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5>{p.title}</h5>
                <p>{p.description}</p>
              </div>
              <footer>
                <button
                  onClick={() => startEdit(p)}
                >
                  Edit
                </button>

                <button
                  onClick={() => remove(p._id)}
                >
                  Delete
                </button>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
    );
}

export default Projects;