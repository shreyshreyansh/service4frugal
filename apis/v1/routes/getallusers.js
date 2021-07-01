const pool = require("../database/model/connect");
const req = require("../functions/request");
const authorization = ["admin"];
module.exports = (request, response) => req(request, response, getallusers);

const getallusers = (req, res, jsondata) => {
  if (authorization.includes(jsondata.role)) {
    pool.query("SELECT * FROM userdata", (err, result) => {
      if (err) res.send({ error: err });
      else
        res.send({
          count: Object.keys(result.rows).length,
          result: result.rows,
        });
    });
  } else res.send({ error: "admin access required" });
};
