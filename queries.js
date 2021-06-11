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

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const registerUser = (req, res) => {
  const sql = "select userid from userdata where userid = $1";
  pool.query(sql, [req.body.userID], (error, result) => {
    if (error) {
      throw error;
    } else {
      //success, user is not there create it
      if (result.rowCount === 0) {
        //the hash has the salt
        (async () => {
          const hash = await bcrypt.hash(req.body.password, 10);
          //store user, password and role
          pool.query(
            "insert into userdata (userid, username, password) values ($1,$2,$3)",
            [req.body.userID, req.body.userName, hash],
            (err, results) => {
              if (err) throw err;
              else res.send({ success: "User created successfully" });
            }
          );
        })();
      } else res.send({ error: "User already exists.." });
    }
  });
};

const findUser = (req, res) => {
  const { userid } = req.body;
  pool.query(
    "select * from userdata where userid = $1",
    [userid],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        const saltedPassword = results.rows[0].password;
        (async () => {
          bcrypt.compare(
            req.body.password,
            saltedPassword,
            function (err, successResult) {
              // result == true
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
        })();
      }
    }
  );
};

const isTokenValid = (req, res) => {
  validateToken(req.body.token, JWT_SECRET).then(
    function (result) {
      if (result) res.send(result);
      else res.send({ error: "tokenId invalid" });
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
      success: "tokenId valid",
      userid: result.userid,
      username: result.username,
      iat: result.iat,
      exp: result.exp,
    };
  } catch (ex) {
    return null;
  }
}

async function randomString() {
  return crypto.randomBytes(64).toString("hex");
}
function sha256(txt) {
  const secret = "abcdefg";
  const hash = crypto.createHmac("sha256", secret).update(txt).digest("hex");
  return hash;
}

module.exports = {
  deleteUser,
  registerUser,
  findUser,
  isTokenValid,
};
