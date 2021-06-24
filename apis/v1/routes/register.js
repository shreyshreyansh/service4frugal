const pool = require("../../../database/model/connect");
const req = require("../../../functions/request");
const bcrypt = require("bcrypt");
const authorization = ["admin"];

module.exports = (request, response) => req(request, response, registerUser);

const registerUser = (req, res, jsondata) => {
  if (authorization.includes(jsondata.role)) {
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
