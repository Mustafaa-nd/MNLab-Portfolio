import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  return (
    <footer
      className={`footer footer-center p-4 transition-colors duration-300 
        ${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-green-200 text-gray-900"}
      `}
    >
      <aside>
        <p>Copyright © MNLabs - All rights reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
