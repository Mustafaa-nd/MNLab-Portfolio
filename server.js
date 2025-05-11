import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import dotenv from "dotenv";
import pkg from "pg"; // PostgreSQL
import path from "path";
import fs from "fs/promises"; // async/await File reading

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Secure CORS
app.use(cors({
  origin: 'https://mustafaa-portfolio.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// PostgreSQL
const { Pool } = pkg;
const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

// Multer config
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create uploads folder if not exist
const uploadDir = "./uploads";
if (!await fs.stat(uploadDir).catch(() => false)) {
  await fs.mkdir(uploadDir);
}

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

    // Img_base64 automatic adding
    const achievements = result.rows.map((project) => {
      if (project.img_base64) {
        project.img = `data:image/jpeg;base64,${project.img_base64}`;
      }
      return project;
    });

    res.json(achievements);
  } catch (err) {
    console.error("Error GET achievements:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// POST Achievement (base64 image)
app.post("/achievements", upload.single("image"), async (req, res) => {
  const { title, description, category } = req.body;
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const base64Image = await fs.readFile(file.path, { encoding: "base64" });
    await fs.unlink(file.path); // delete file after reading it

    const result = await db.query(
      `INSERT INTO achievements (id, title, description, category, img_base64, likes, liked, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id`,
      [Date.now(), title, description, category || "Other", base64Image, 0, false]
    );

    res.status(201).json({ message: "Achievement added successfully", id: result.rows[0].id });
  } catch (err) {
    console.error("Error POST:", err.message);
    res.status(500).json({ error: "Error adding project" });
  }
});

// PUT Update Project
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

// PUT Like / Unlike
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

// DELETE Project
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

// GET Categories
app.get("/categories", async (req, res) => {
  try {
    const result = await db.query("SELECT DISTINCT category FROM achievements ORDER BY category ASC");
    res.json(result.rows.map(row => row.category));
  } catch (err) {
    console.error("Error GET categories:", err.message);
    res.status(500).json({ error: "Error loading categories" });
  }
});

// GET Recent
app.get("/achievements/recent", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM achievements ORDER BY created_at DESC LIMIT 3");
    res.json(result.rows);
  } catch (err) {
    console.error("Error /recent:", err.message);
    res.status(500).json({ error: "Server issue" });
  }
});

// GET by ID
app.get("/achievements/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM achievements WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Project not found" });

    const project = result.rows[0];
    if (project.img_base64) {
      project.img = `data:image/jpeg;base64,${project.img_base64}`;
    }

    res.json(project);
  } catch (err) {
    console.error("Error GET id:", err.message);
    res.status(500).json({ error: "Server issue" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
