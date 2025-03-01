import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const { login } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); 

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); 

    
    if (username === "mustafaa" && password === "Mustafaa_thed0c789") {
      login({ username, role: "admin" });
      navigate("/");
    } else {
      setError("Invalid username or password!"); 
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"
    }`}>
      <div className={`p-8 rounded-lg shadow-xl w-full max-w-md transform transition duration-500 hover:scale-105 ${
        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white"
      }`}>
        <h2 className="text-2xl font-bold text-center">
          Welcome to MNLaboratory🧪
        </h2>
        <h2 className="text-xl font-semibold text-center mb-6">
          Login page
        </h2>
        
        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500" : "border-gray-300 focus:ring-green-500"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500" : "border-gray-300 focus:ring-green-500"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-800 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-sm opacity-75">
          Only admins can log in.
        </p>
      </div>
    </div>
  );
};

export default Login;
