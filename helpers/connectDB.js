const { Client } = require("pg");
// Load environment variables
require("dotenv").config();

// Create a database client
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  allowExitOnIdle: true,
};
// patron Singleton instance
const Singleton = (() => {
  let instance;
  function createInstance() {
    const classObj = new Client(config);
    return classObj;
  }
  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
        console.log(" Nueva conexión a la base de datos establecida");
      } else {
        console.log("Establecida la conexión a la base de datos");
      }
      return instance;
    },
  };
})();

module.exports = Singleton;
