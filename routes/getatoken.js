const pool = require("../database/connect");

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
