import ListComponent from "../Components/ListComponent";
import service1 from "../assets/service1.jpg";
import service2 from "../assets/service2.jpg";
import service3 from "../assets/service3.jpg";
import { useEffect, useState } from "react";
import { api } from "../api";


const services = [
    {
        imagePath:service1,
        title:"Debugging & Redesigning",
        text:"I debug by identifying and fixing errors, and I redesign by improving existing designs for better function and appearance.",
    },
    {
        imagePath:service2,
        title:"UI/UX Design & Web Components",
        text:"I work on UI/UX design by creating user-friendly, visually appealing interfaces, and I build web components that make websites more functional, reusable, and efficient.",
    },
    {
        imagePath:service3,
        title:"Web Design & Game Design",
        text:"I do web design by building attractive, responsive websites, and game design by creating engaging gameplay experiences with thoughtful mechanics and visuals.",
    },
];

function Services(){

  const [services, setServices] = useState([]);
  const [editID, setEditID] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    imagePath: "",
    title: "",
    text: ""
  });

  useEffect(() => {
    api.getServices()
      .then((data) => setServices(data))
      .catch(() => setMessage("Could not load services."));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
        if (editID) {
          const updated = await api.updateService(editID, form);
          setServices((prev) =>
            prev.map((s) => (s._id === editID ? updated : s))
          );
          setMsg("Service updated.");
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

    const startEdit = (service) => {
        setEditID(service._id);
        setForm({
          imagePath: service.imagePath,
          title: service.title,
          text: service.text
        });
      };

      const remove = async (id) => {
        if (!window.confirm("Delete this service?")) return;
    
        try {
          await api.deleteService(id);
          setServices((prev) => prev.filter((s) => s._id !== id));
          setMessage("Service deleted.");
        } catch {
            setMessage("Could not delete service.");
        }
      };


    return(
        <section className="page services">
        <h2>My Services</h2>
  
        <ListComponent items={Services} />
  
        <h3>Manage Services</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="image"
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
          />
  
          <textarea
            name="description"
            rows={3}
            placeholder="Description"
            value={form.title}
            onChange={handleChange}
          />
  
          <button>
            {editID ? "Update" : "Add Service"}
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
        <h4>Saved Services</h4>

      <div>
        {services.map((s) => (
          <article key={s._id}>
            <div>
              <h5>{s.imagePath}</h5>
              <p><strong>Title:</strong> {s.title}</p>
              <p>{s.description}</p>

              <div >
                <button
                  onClick={() => startEdit(s)}
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(s._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
    );
}

export default Services;
