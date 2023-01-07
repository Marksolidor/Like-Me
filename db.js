const { Client } = require("pg");
const util = require("util");

// Load environment variables
require("dotenv").config();

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

// GET path to get the records of the post table
const getPosts = async () => {
  let query = "SELECT * FROM posts";
  try {
    const result = await client.query(query);
    if (result.rows.length === 0) {
      return { error: "No se encontraron registros" };
    } else {
      return result.rows.map((row) => ({
        id: row.id,
        titulo: row.titulo,
        img: row.img,
        descripcion: row.descripcion,
        likes: row.likes,
      }));
    }
  } catch (error) {
    console.error(error);
    return { error };
  }
};

// POST path to store a new record in the post table
const createPost = async (titulo, url, descripcion, likes) => {
  // Validate that the title, image and description are not empty.
  if (!titulo || !url || !descripcion) {
    return {
      error: "El título, la imagen y la descripción son campos requeridos",
    };
  }

  try {
    const result = await client.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, url, descripcion, likes]
    );
    return result;
  } catch (error) {
    console.error(error);
    return { error };
  }
};

module.exports = {
  getPosts,
  createPost,
};
