//packages
const express = require("express");
const bodyParser = require("body-parser");
//functions
const register = require("./routes/register");
const getallusers = require("./routes/getallusers");
const getauser = require("./routes/getauser");
const getalltokens = require("./routes/getalltokens");
const getatoken = require("./routes/getatoken");
const login = require("./routes/login");
const deleteuser = require("./routes/deleteuser");
const istokenvalid = require("./routes/istokenvalid");

//express app
const app = express();

//port
const port = 4000;

//for forms
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//routes
app.post("/register", (req, res) => {
  register(req, res);
});

app.post("/getallusers", (req, res) => {
  getallusers(req, res);
});

app.post("/getauser", (req, res) => {
  getauser(req, res);
});

app.post("/getalltokens", (req, res) => {
  getalltokens(req, res);
});

app.post("/getatoken", (req, res) => {
  getatoken(req, res);
});

app.post("/login", (req, res) => {
  login(req, res);
});

app.post("/istokenvalid", (req, res) => {
  istokenvalid(req, res);
});

app.delete("/deleteuser", (req, res) => {
  deleteuser(req, res);
});

//listening...
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
