import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Contact = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }

    setSuccess("Your message has been sent successfully! 🚀");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className={`mt-20 min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`}>

      <div className="breadcrumbs text-base ">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="text-green-700 hover:underline">Home</Link>
          </li>
          <li className="text-gray-500">Contact</li>
        </ul>
      </div>

      <div className={`w-full max-w-2xl p-8 rounded-lg shadow-lg transition-all ${
        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"
      }`}>
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Get in Touch ✉️
        </h2>

        {error && <p className="text-red-500 bg-red-100 p-2 text-center rounded">{error}</p>}
        {success && <p className="text-green-500 bg-green-100 p-2 text-center rounded">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition ${
                theme === "dark" ? "bg-gray-700 border-gray-600 focus:ring-green-500 text-white" : "border-gray-300 focus:ring-green-500"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition ${
                theme === "dark" ? "bg-gray-700 border-gray-600 focus:ring-green-500 text-white" : "border-gray-300 focus:ring-green-500"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Your Message</label>
            <textarea
              placeholder="Write your message here..."
              rows="5"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition ${
                theme === "dark" ? "bg-gray-700 border-gray-600 focus:ring-green-500 text-white" : "border-gray-300 focus:ring-green-500"
              }`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold shadow-md bg-green-700 text-white hover:bg-green-800 transition-all duration-300"
          >
            Send Message 🚀
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p>Or reach me via:</p>
          <p>
            📧 <a href="mailto:moustaphand1502@gmail.com" className="text-green-500 hover:underline">moustaphand1502@gmail.com</a>
          </p>
          <p>
            📞 <a href="tel:+221778860293" className="text-green-500 hover:underline">+221 77 886 02 93</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
