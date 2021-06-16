const Pool = require("pg").Pool;
const pool = new Pool({
  user: "frugal",
  host: "localhost",
  database: "users",
  password: "password",
  port: 5432,
});

//----------------------delete a user------------------//

module.exports = (request, response) => {
  const id = request.params.userid;
  console.log(id);
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
