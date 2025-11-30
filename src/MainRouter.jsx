import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";

// pages (in the components folder)
import Home from "./Components/Home";
import About from "./Components/About";
import Projects from "./Components/Projects";
import Services from "./Components/Services";
import Contact from "./Components/Contact";
import Login from "./Components/login.jsx";
import Register from "./Components/Register.jsx";
import UserAdmin from "./Components/UserAdmin.jsx";



function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />}/>
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/useradmin" element={<UserAdmin />} />
            </Route>
        </Routes>
    );
}

export default MainRouter;