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

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
