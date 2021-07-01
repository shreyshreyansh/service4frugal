const pool = require("../database/model/connect");
const req = require("../functions/request");
const authorization = ["admin"];
module.exports = (request, response) => req(request, response, getatoken);

const getatoken = (req, res, jsondata) => {
  if (
    authorization.includes(jsondata.role) ||
    jsondata.userid === req.body.userid
  ) {
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
  } else res.send({ error: "admin access required or invalid token id" });
};
