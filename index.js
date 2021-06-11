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

app.get("/getallusers", db.getallusers);

app.post("/getauser", db.getauser);

app.get("/getalltokens", db.getalltokens);

app.post("/getatoken", db.getatoken);

app.post("/login", db.loginUser);

app.post("/istokenvalid", db.isTokenValid);

app.delete("/users/:id", db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
