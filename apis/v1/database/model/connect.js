const Pool = require("pg").Pool;
module.exports = new Pool({
  user: "frugal",
  host: "localhost",
  database: "users",
  password: "password",
  port: 5432,
});
