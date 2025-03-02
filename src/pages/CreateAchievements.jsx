import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../AuthContext"; 

const CreateAchievements = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other"); 
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

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
      const response = await fetch("http://localhost:5000/achievements", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error adding achievement");

      navigate("/achievements");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <div className={`mt-16 min-h-screen flex items-center justify-center p-8 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
    }`}>
      <div className={`rounded-2xl shadow-2xl p-8 transition-transform will-change-transform text-center border ${
        theme === "dark"
          ? "bg-gray-900 border-green-500 shadow-green-500/50"
          : "bg-gray-500 border-green-500 shadow-green-300/50"
      }`}>

      <div className="flex flex-col items-center justify-center breadcrumbs text-base mb-4">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="text-green-700 hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/achievements" className="text-green-700 hover:underline">Achievements</Link>
          </li>
          <li className="text-gray-500">Add Achievement</li>
        </ul>
      </div>

        <h1 className="text-4xl font-extrabold mb-4 uppercase tracking-wide text-green-400">
          Add an Achievement
        </h1>

        <form onSubmit={handleSubmit} className="mb-6 flex flex-col items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title "
            className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project"
            className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500"
            required
          />

          <h5>Please select a category</h5>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500"
          >
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Data Science">Data Science</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>
          
          <h5>Please upload a picture for your project</h5>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full max-w-md px-4 py-3 border rounded-lg focus:ring-2 placeholder-gray-500" required />
          
          {preview && <img src={preview} alt="Preview" className="w-40 h-40 mt-4 rounded-lg shadow-md" />}

          <button type="submit" className="w-auto px-6 py-3 rounded-lg flex items-center gap-2 shadow-md transition-all bg-green-500 hover:bg-green-600 text-white">
            <PlusCircle size={20} />
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAchievements;
