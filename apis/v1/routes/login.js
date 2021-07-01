const pool = require("../database/model/connect");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";

//----------------login a user---------------//

module.exports = (req, res) => {
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
          role: results.rows[0].role,
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

//--------------functions for tokens----------------//

async function randomString() {
  return crypto.randomBytes(64).toString("hex");
}
function sha256(txt) {
  const secret = "abcdefg";
  const hash = crypto.createHmac("sha256", secret).update(txt).digest("hex");
  return hash;
}
