// scripts/importAchievements.js

import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const importAchievements = async () => {
  const filePath = path.join("public", "data", "achievements.json");

  try {
    const data = fs.readFileSync(filePath, "utf8");
    const achievements = JSON.parse(data);

    for (const a of achievements) {
      await pool.query(
        `INSERT INTO achievements (id, title, description, img, category, likes, liked)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           img = VALUES(img),
           category = VALUES(category),
           likes = VALUES(likes),
           liked = VALUES(liked)
        `,
        [
          a.id,
          a.title,
          a.description,
          a.img,
          a.category,
          a.likes,
          a.liked,
        ]
      );
    }

    console.log("Achievements importés avec succès dans MySQL.");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de l'import :", err);
    process.exit(1);
  }
};

importAchievements();
