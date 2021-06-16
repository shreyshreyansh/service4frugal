const Pool = require("pg").Pool;
const pool = new Pool({
  user: "frugal",
  host: "localhost",
  database: "users",
  password: "password",
  port: 5432,
});

//----------------see a specific the token-------------//

module.exports = (req, res) => {
  pool.query(
    "SELECT * FROM tokendata where userid = $1",
    [req.body.userid],
    (err, result) => {
      if (err) res.send({ error: err });
      else
        res.send({
          count: Object.keys(result.rows).length,
          result: result.rows,
        });
    }
  );
};
