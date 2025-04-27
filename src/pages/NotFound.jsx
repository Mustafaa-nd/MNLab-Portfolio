import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center text-center p-8 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
    }`}>
      <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Yo! I don't have that page</h2>
      <p className="text-lg opacity-75 mb-6">
        The page you're looking for doesn't exist or has been moved. 
        <br />
        Feel free to reach out if you're looking for something specific!
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-all"
      >
        🏠Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
