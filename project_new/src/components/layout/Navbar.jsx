import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar({
  loggedIn,
  setLoggedIn,
  profile,
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("nextoffer-logged-in");
    navigate("/");
  };

  const avatarInitial = profile?.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Next<span>Offer</span>
      </Link>

      {loggedIn && (
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/topics">Topics</NavLink>
          <NavLink to="/roadmap">Roadmap</NavLink>
          <NavLink to="/mock-interview">Interview</NavLink>
          <NavLink to="/resume">Resume</NavLink>
        </nav>
      )}

      <div className="navbar-right">
        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {loggedIn && (
          <Link to="/profile" className="profile-button" title="View Profile">
            <span className="profile-avatar">{avatarInitial}</span>
            <span className="profile-name">{profile?.name || "Profile"}</span>
          </Link>
        )}

        {loggedIn ? (
          <button
            className="small-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="small-button">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
