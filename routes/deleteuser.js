const pool = require("../database/connect");

//----------------------delete a user------------------//

module.exports = (request, response) => {
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
