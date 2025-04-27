import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import dotenv from "dotenv";
import pkg from "pg"; // Utiliser PostgreSQL
import path from "path";
import fs from "fs";

console.log("Server file loaded, waiting for requests...");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; //important pour Render !

// Secure CORS
app.use(cors({
  origin: "*", // en production je peux préciser mon domaine
  credentials: true,
}));

app.use(bodyParser.json());

// PostgreSQL connection
const { Pool } = pkg;
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

// Upload folder
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(" 'uploads' folder created successfully!");
}

// Upload config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// GET achievements with filters
app.get("/achievements", async (req, res) => {
  const { category, search } = req.query;
  try {
    let query = "SELECT * FROM achievements";
    const values = [];
    let idx = 1;

    if (category || search) {
      query += " WHERE";
      if (category) {
        query += ` LOWER(category) = $${idx++}`;
        values.push(category.trim().toLowerCase());
      }
      if (search) {
        if (category) query += " AND";
        query += ` (LOWER(title) LIKE $${idx} OR LOWER(description) LIKE $${idx} OR LOWER(category) LIKE $${idx})`;
        const term = `%${search.trim().toLowerCase()}%`;
        values.push(term);
      }
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error GET achievements:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST - Add an achievement
app.post("/achievements", upload.single("image"), async (req, res) => {
  const { title, description, category } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(
      "INSERT INTO achievements (id, title, description, category, img, likes, liked, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id",
      [Date.now(), title, description, category || "Other", imagePath, 0, false]
    );
    res.status(201).json({ message: "Achievement added successfully", id: result.rows[0].id });
  } catch (err) {
    console.error("Error POST:", err.message);
    res.status(500).json({ error: "Error adding project" });
  }
});

// PUT - Edit an achievement
app.put("/achievements/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const result = await db.query(
      "UPDATE achievements SET title = $1, description = $2, category = $3 WHERE id = $4",
      [title, description, category, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project updated successfully" });
  } catch (err) {
    console.error("Error PUT:", err.message);
    res.status(500).json({ error: "Error updating project" });
  }
});

// PUT - Like/Unlike
app.put("/achievements/:id/like", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const result = await db.query("SELECT likes FROM achievements WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Project not found" });

    let likes = result.rows[0].likes;
    let liked = false;

    if (action === "like") {
      likes += 1;
      liked = true;
    } else if (action === "unlike" && likes > 0) {
      likes -= 1;
      liked = false;
    }

    await db.query("UPDATE achievements SET likes = $1, liked = $2 WHERE id = $3", [likes, liked, id]);
    res.json({ message: `Like ${action} successful`, likes, liked });
  } catch (err) {
    console.error("Error LIKE:", err.message);
    res.status(500).json({ error: "Error processing like" });
  }
});

// DELETE - Delete an achievement
app.delete("/achievements/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM achievements WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error DELETE:", err.message);
    res.status(500).json({ error: "Error deleting project" });
  }
});

// GET - Categories
app.get("/categories", async (req, res) => {
  try {
    const result = await db.query("SELECT DISTINCT category FROM achievements ORDER BY category ASC");
    const categories = result.rows.map(row => row.category);
    res.json(categories);
  } catch (err) {
    console.error("Error GET /categories:", err.message);
    res.status(500).json({ error: "Error loading categories" });
  }
});

// GET - Recent achievements
app.get("/achievements/recent", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM achievements ORDER BY created_at DESC LIMIT 3");
    res.json(result.rows);
  } catch (err) {
    console.error("Error /achievements/recent:", err.message);
    res.status(500).json({ error: "Server issue" });
  }
});

// GET - Specific achievement by ID
app.get("/achievements/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM achievements WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Project not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error GET id:", err.message);
    res.status(500).json({ error: "Server issue" });
  }
});

// Static uploads
app.use("/uploads", express.static("uploads"));

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running...`);
});
