const express = require("express");
const cors = require("cors");
const { getPosts, createPost, updatePostLikes, deletePost } = require("./db");

const app = express();

// Enable use of static files in the "public" folder
app.use(express.static("public"));

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

// GET path to get the records of the post table
app.get("/posts", async (req, res) => {
  const result = await getPosts();
  if (result.error) {
    res.status(404).json({ error: result.error });
  } else {
    res.json(result);
  }
});

// POST path to store a new record in the post table
app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion, likes } = req.body;
  const result = await createPost(titulo, url, descripcion, likes);
  if (result.error) {
    res.status(422).json({ error: result.error });
  } else {
    res.json(result);
  }
});

// PUT path to increase like on the table
app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  const result = await updatePostLikes(id);
  if (result.error) {
    res.status(404).json({ error: result.error });
  } else {
    res.json(result);
  }
});

// DELETE path to delete a record from the post table
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const result = await deletePost(id);
  if (result.error) {
    res.status(404).json({ error: result.error });
  } else {
    res.json(result);
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
