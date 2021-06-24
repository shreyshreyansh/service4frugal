const jwt = require("jsonwebtoken");

const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
//----------------is token valid--------------------//

module.exports = (req, res) => {
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
      role: result.role,
      iat: result.iat,
      exp: result.exp,
      status: 1,
    };
  } catch (ex) {
    return null;
  }
}
