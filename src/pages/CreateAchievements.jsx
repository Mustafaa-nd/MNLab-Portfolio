import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../AuthContext";
import { motion } from "framer-motion";


const CreateAchievements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    handleThemeChange();
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error while loading Categories:", err));
  }, [BACKEND_URL]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", file);

    try {
      const response = await fetch(`${BACKEND_URL}/achievements`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error adding achievement");

      navigate("/achievements");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <motion.div className={`mt-20 min-h-screen flex items-center justify-center p-8 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
    }`}
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6 }}>
      <div className={`rounded-2xl shadow-2xl p-8 transition-transform will-change-transform text-center border ${
        theme === "dark" ? "bg-gray-900 border-green-500 shadow-green-500/50" : "bg-gray-500 border-green-500 shadow-green-300/50"
      }`}>
        <div className="flex flex-col items-center justify-center breadcrumbs text-base mb-4">
          <ul className="flex space-x-2">
            <li><Link to="/" className="text-green-700 hover:underline">Home</Link></li>
            <li><Link to="/achievements" className="text-green-700 hover:underline">Achievements</Link></li>
            <li className="text-gray-500">Add Achievement</li>
          </ul>
        </div>

        <motion.h1 className="text-4xl font-extrabold mb-4 uppercase tracking-wide text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
          Add an Achievement
        </motion.h1>

        <motion.form 
          onSubmit={handleSubmit} 
          className="mb-6 flex flex-col items-center gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}>
          <motion.input
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500"
            required
          />
          <motion.textarea
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500"
            required
          />

          <h5>Please select a category</h5>
          <motion.select
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500"
          >
            {categories.length === 0 ? (
              <option value="">Loading...</option>
            ) : (
              categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))
            )}
          </motion.select>

          <h5>Please upload a picture for your project</h5>
          <motion.input
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full max-w-md px-4 py-3 border rounded-lg focus:ring-2 placeholder-gray-500"
            required
          />

          {preview && (
            <motion.img 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            src={preview} alt="Preview" className="w-40 h-40 mt-4 rounded-lg shadow-md" />
          )}

          <motion.button
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            type="submit"
            className="w-auto px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all bg-green-500 hover:bg-green-600 text-white"
          >
            <PlusCircle size={20} />
            Add
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default CreateAchievements;
