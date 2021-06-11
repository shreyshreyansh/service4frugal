const Pool = require("pg").Pool;
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";

const pool = new Pool({
  user: "frugal",
  host: "localhost",
  database: "users",
  password: "password",
  port: 5432,
});

//----------register a user--------------//

const registerUser = (req, res) => {
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
    console.error(error);
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

//----------------see all the users-------------//

const getallusers = (req, res) => {
  pool.query("SELECT * FROM userdata", (err, result) => {
    if (err) res.send({ error: err });
    else
      res.send({ count: Object.keys(result.rows).length, result: result.rows });
  });
};

//----------------see a specific the users-------------//

const getauser = (req, res) => {
  pool.query(
    "SELECT * FROM userdata where userid = $1",
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

//----------------see all the tokens-------------//

const getalltokens = (req, res) => {
  pool.query("SELECT * FROM tokendata", (err, result) => {
    if (err) res.send({ error: err });
    else
      res.send({ count: Object.keys(result.rows).length, result: result.rows });
  });
};

//----------------see a specific the token-------------//

const getatoken = (req, res) => {
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

//----------------login a user---------------//

const loginUser = (req, res) => {
  const { userid } = req.body;
  pool.query(
    "SELECT * FROM userdata WHERE userid = $1",
    [userid],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        const saltedPassword = results.rows[0].password;
        checkSaltPasswordAndUpdateToken(req, res, saltedPassword, results);
      }
    }
  );
};

async function checkSaltPasswordAndUpdateToken(
  req,
  res,
  saltedPassword,
  results
) {
  bcrypt.compare(
    req.body.password,
    saltedPassword,
    function (err, successResult) {
      if (successResult === true) {
        const payLoad = {
          userid: results.rows[0].userid,
          username: results.rows[0].username,
        };
        const token = jwt.sign(payLoad, JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: 60 * 5,
        });
        pool.query(
          "update tokendata set tokenid = $1 where userid = $2",
          [token, results.rows[0].userid],
          (err, results) => {
            if (err) throw err;
            else
              res.send({
                success: "Logged in successfully!",
                tokenid: token,
              });
          }
        );
      } else res.send({ error: "Incorrect username or password" });
    }
  );
}

//----------------------delete a user------------------//

const deleteUser = (request, response) => {
  const id = request.params.userid;

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
};

//----------------is token valid--------------------//

const isTokenValid = (req, res) => {
  validateToken(req.body.token, JWT_SECRET).then(
    function (result) {
      if (result) res.send(result);
      else res.send({ error: "tokenId invalid", status: 0 });
    },
    function (error) {
      res.send(error);
    }
  );
};

async function validateToken(token, secret) {
  try {
    const result = jwt.verify(token, secret);
    return {
      success: "tokenid valid",
      userid: result.userid,
      username: result.username,
      iat: result.iat,
      exp: result.exp,
      status: 1,
    };
  } catch (ex) {
    return null;
  }
}

//--------------functions for tokens----------------//

async function randomString() {
  return crypto.randomBytes(64).toString("hex");
}
function sha256(txt) {
  const secret = "abcdefg";
  const hash = crypto.createHmac("sha256", secret).update(txt).digest("hex");
  return hash;
}

//---------------export the functions---------------//
module.exports = {
  getallusers,
  getauser,
  getalltokens,
  getatoken,
  deleteUser,
  registerUser,
  loginUser,
  isTokenValid,
};
