const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const util = require("util");
const app = express();

// Enable use of static files in the "public" folder
app.use(express.static("public"));

// Load environment variables
require("dotenv").config();

// Enable CORS
app.use(cors());

// Path to display the index.html file
app.get("/", (req, res) => {
  try {
    return res.sendFile(__dirname + "/public/index.html");
  } catch (e) {
    console.log("error");
  }
});

// Process the body of the request
app.use(express.json());

// Create a database client
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  allowExitOnIdle: true,
});

// Connect to the database
client.connect();

// Convert client.query to an asynchronous function
client.query = util.promisify(client.query);

// Error handling
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error });
});

// GET path to get the records of the post table
app.get("/posts", async (req, res) => {
  // Add a parameter to filter by id
  const id = req.query.id;
  let query = "SELECT * FROM posts";
  let params = [];
  if (id) {
    query += " WHERE id = $1";
    params.push(id);
  }
  try {
    const result = await client.query(query, params);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "No se encontraron registros" });
    } else {
      res.json(
        result.rows.map((row) => ({
          id: row.id,
          titulo: row.titulo,
          img: row.img,
          descripcion: row.descripcion,
          likes: row.likes,
        }))
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// POST path to store a new record in the post table
app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion, likes } = req.body;

  // Validate that the title, image and description are not empty.
  if (!titulo || !url || !descripcion) {
    return res.status(422).json({
      error: "El título, la imagen y la descripción son campos requeridos",
    });
  }

  try {
    const result = await client.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, url, descripcion, likes]
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
