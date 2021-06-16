const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "frugal",
  host: "localhost",
  database: "users",
  password: "password",
  port: 5432,
});

//----------register a user--------------//

module.exports = (req, res) => {
  const sql = "SELECT userid FROM userdata WHERE userid = $1";
  pool.query(sql, [req.body.userid], (error, result) => {
    if (error) {
      res.send({ error: error });
    } else {
      if (result.rowCount === 0) {
        hashPasswordAndInsertUserInDB(req, res);
      } else res.send({ error: "User already exists" });
    }
  });
};

async function hashPasswordAndInsertUserInDB(req, res) {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    insertUserIntoUserdata(req, res, hash);
  } catch (error) {
    console.log(error);
  }
}

async function insertUserIntoUserdata(req, res, hash) {
  pool.query(
    "INSERT INTO userdata (userid, username, password) values ($1,$2,$3)",
    [req.body.userid, req.body.username, hash],
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
