//packages
const express = require("express");
const bodyParser = require("body-parser");
//functions
const register = require("./apis/v1/routes/register");
const getallusers = require("./apis/v1/routes/getallusers");
const getauser = require("./apis/v1/routes/getauser");
const getalltokens = require("./apis/v1/routes/getalltokens");
const getatoken = require("./apis/v1/routes/getatoken");
const login = require("./apis/v1/routes/login");
const deleteuser = require("./apis/v1/routes/deleteuser");
const istokenvalid = require("./apis/v1/routes/istokenvalid");

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
