const pool = require("../database/connect");
const bcrypt = require("bcrypt");
var http = require("http");

//----------register a user--------------//
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
        registerUser(request, response, jsondata);
      }
    });
  });
  req.on("error", (error) => {
    console.error(error);
  });
  req.write(data);
  req.end();
};

const registerUser = (req, res, jsondata) => {
  if (jsondata.role === "admin") {
    const sql = "SELECT userid FROM userdata WHERE userid = $1";
    pool.query(sql, [req.body.userid], (err, result) => {
      if (err) {
        res.send({ error: err });
      } else {
        if (result.rowCount === 0) {
          hashPasswordAndInsertUserInDB(req, res);
        } else res.send({ error: "User already exists" });
      }
    });
  } else res.send({ error: "admin access required" });
};

async function hashPasswordAndInsertUserInDB(req, res) {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    insertUserIntoUserdata(req, res, hash);
  } catch (error) {
    throw error;
  }
}

async function insertUserIntoUserdata(req, res, hash) {
  pool.query(
    "INSERT INTO userdata (userid, username, password, role) values ($1,$2,$3,$4)",
    [req.body.userid, req.body.username, hash, "user"],
    (err, results) => {
      if (err) throw err;
      else {
        insetUserinTokendata(req, res);
      }
    }
  );
}

async function insetUserinTokendata(req, res) {
  pool.query(
    "INSERT INTO tokendata (userid, tokenid) values ($1,$2)",
    [req.body.userid, null],
    (err, results) => {
      if (err) throw err;
      else {
        res.send({ success: "User created successfully" });
      }
    }
  );
}
