const pool = require("../../../database/model/connect");
const req = require("../../../functions/request");
const authorization = ["admin"];
module.exports = (request, response) => req(request, response, deleteuser);

const deleteuser = (request, response, jsondata) => {
  if (authorization.includes(jsondata.role)) {
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
