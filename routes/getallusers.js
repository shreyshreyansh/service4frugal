const pool = require("../database/connect");

//----------------see all the users-------------//

const getallusers = (req, res) => {
  pool.query("SELECT * FROM userdata", (err, result) => {
    if (err) res.send({ error: err });
    else
      res.send({ count: Object.keys(result.rows).length, result: result.rows });
  });
};

module.exports = getallusers;
