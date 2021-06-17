const pool = require("../database/connect");
var http = require("http");
//----------------------delete a user------------------//

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
        deleteuser(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const deleteuser = (request, response, jsondata) => {
  if (jsondata.role === "admin") {
    const id = request.body.userid;
    pool.query(
      "DELETE FROM userdata WHERE userid = $1",
      [id],
      (error, results) => {
        if (error) {
          throw error;
        } else {
          pool.query(
            "DELETE FROM tokendata WHERE userid = $1",
            [id],
            (err, res) => {
              if (err) throw err;
              else
                response
                  .status(200)
                  .send({ success: `User deleted with ID: ${id}` });
            }
          );
        }
      }
    );
  } else response.send({ error: "admin access required" });
};
