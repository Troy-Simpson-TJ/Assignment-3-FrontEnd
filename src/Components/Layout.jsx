import { Link, Outlet } from "react-router-dom";
import image_logo from "../assets/troylogo.jpg";
import Footer from "./Footer";

function Layout (){
  return (
    <div>
    <header className="navbar">
      <img src={image_logo} alt="Logo" className="logo" />
      <nav className="nav-links">
      <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin/users">Users</Link>
      </nav>
    </header>
    <Outlet />
    <Footer />
  </div>
  
  );
}

export default Layout;

