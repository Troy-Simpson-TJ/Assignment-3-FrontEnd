import { Link, Outlet } from "react-router-dom";
import image_logo from "../assets/troylogo.jpg";
import Footer from "./Footer";
import {useAuth} from "../context/authContext";

function Layout (){
  const {user,logout} = useAuth();
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

          {/* Admin/users only if logged in */}
          {user && (
            <Link to="/admin/users">
              Users
            </Link>
          )}

          {/* Auth links */}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {/* Logout button */}
          {user && (
            <button onClick={logout}>
              Logout
            </button>
          )}
      </nav>
    </header>
    <Outlet />
    <Footer />
  </div>
  
  );
}

export default Layout;

