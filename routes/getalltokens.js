const Pool = require("pg").Pool;
const pool = new Pool({
  user: "frugal",
  host: "localhost",
  database: "users",
  password: "password",
  port: 5432,
});

//----------------see all the tokens-------------//

module.exports = (req, res) => {
  pool.query("SELECT * FROM tokendata", (err, result) => {
    if (err) res.send({ error: err });
    else
      res.send({ count: Object.keys(result.rows).length, result: result.rows });
  });
};
