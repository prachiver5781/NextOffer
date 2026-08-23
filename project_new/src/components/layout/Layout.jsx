import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({
  loggedIn,
  setLoggedIn,
  profile,
  darkMode,
  setDarkMode,
}) {
  return (
    <div className="app-shell">
      <Navbar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        profile={profile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
