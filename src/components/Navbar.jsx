import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext"; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event("themeChange"));
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
    window.dispatchEvent(new Event("themeChange"));
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 w-full transition-transform duration-300 z-50 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${theme === "dark" ? "bg-gray-900 text-green-600" : "bg-white text-green-900"} shadow-md`}
    >
      <div className="navbar">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">
            MNLab
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/studies">Studies</Link>
            </li>
            <li>
              <Link to="/achievements">Achievements</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end flex gap-4">
          {user && (
            <button onClick={logout} className="btn bg-red-500 text-white">
              Logout
            </button>
          )}

          <label className="swap swap-rotate">
            <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} />
            <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64 17l-.71.71a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l.71-.71A1 1 0 0 0 5.64 17zm-1.64-5a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1zm7-7a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1zm-6.36 2.05a1 1 0 0 0 .7.29 1 1 0 0 0 .71-.29 1 1 0 0 0 0-1.41L4.93 4.93a1 1 0 0 0-1.41 1.41zM17.66 7.34a1 1 0 0 0 .7-.29l.71-.71a1 1 0 1 0-1.41-1.41l-.71.71a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29zM21 11h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm-9 8a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zm6.36-2a1 1 0 0 0-.7.29l-.71.71a1 1 0 0 0 1.41 1.41l.71-.71a1 1 0 0 0-.71-1.71zm-6.36-9.5a5.5 5.5 0 1 0 5.5 5.5 5.5 5.5 0 0 0-5.5-5.5zm0 9a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z" />
            </svg>
            <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.06 8.06 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.15 8.6 8.6 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-.74zm-9.5 6.69A8.15 8.15 0 0 1 7.08 5.22v.27A10.15 10.15 0 0 0 17.22 15.63a9.79 9.79 0 0 0 2.1-.22 8.12 8.12 0 0 1-7.18 4.28z" />
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
