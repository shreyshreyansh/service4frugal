const express = require("express");
const bodyParser = require("body-parser");
const db = require("./queries");
const app = express();

const port = 4000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/register.html");
});

app.post("/register", db.registerUser);

app.post("/finduser", db.findUser);

app.delete("/users/:id", db.deleteUser);

app.post("/istokenvalid", db.isTokenValid);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
