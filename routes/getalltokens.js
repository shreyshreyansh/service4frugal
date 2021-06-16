const pool = require("../database/connect");
var http = require("http");

//----------------see all the tokens-------------//

module.exports = (request, response) => {
  var data = JSON.stringify({ token: request.body.tokenid });
  var options = {
    host: "localhost",
    port: "4000",
    path: "/istokenvalid",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };
  const req = http.request(options, (res) => {
    res.on("data", (d) => {
      var jsondata = JSON.parse(d);
      if (jsondata.status == 0) {
        response.send({ error: "token id expired or incorrect" });
      } else {
        getalltokens(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const getalltokens = (req, res, jsondata) => {
  if (jsondata.role === "admin") {
    pool.query("SELECT * FROM tokendata", (err, result) => {
      if (err) res.send({ error: err });
      else
        res.send({
          count: Object.keys(result.rows).length,
          result: result.rows,
        });
    });
  } else res.send({ error: "admin access required" });
};
