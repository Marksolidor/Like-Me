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

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
