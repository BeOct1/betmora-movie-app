import React from "react";
import { Link } from "react-router-dom";
import "../../styles.css";

const Navbar = () => {
  // Simulate active link detection (replace with useLocation for real app)
  const current = window.location.pathname;
  const links = [
    { to: "/", label: "Search" },
    { to: "/splash", label: "Splash" },
    { to: "/about", label: "About" },
    { to: "/favorites", label: "Favorites" },
    { to: "/watchlist", label: "Watchlist" },
    { to: "/recommendations", label: "Recommendations" },
    { to: "/profile", label: "Profile" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];
  return (
    <nav className="navbar">
      <div className="nav-links">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={"nav-link" + (current === link.to ? " active" : "")}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* Avatar placeholder for profile */}
      <img className="avatar" src="/logo192.png" alt="avatar" />
    </nav>
  );
};

export default Navbar;
