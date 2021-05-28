const http = require("http");
const express = require("express");
const config = require("../config.js");
const socket = require("./lib/socket");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const app = express();

const SECRETKEY = "qwert@321";
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

//app.use("/", express.static(`${__dirname}/../client`));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  //getting the token from the header
  const bearer = req.headers["authorization"];
  if (bearer) {
    const bearerToken = bearer.split(" ");
    const token = bearerToken[1];

    jwt.verify(token, SECRETKEY, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.userData = data;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

app.post("/delete-user", verifyToken, (req, res) => {
  //block-2
  console.log("userData block-2", req.userData);
  res.send("User Deleted");
});

app.post("/login", (req, res) => {
  //check for user name and pswd

  const { username, password, role } = req.body.reqData;
  //database authenticate username and password
  // console.log(username,password)

  if (
    (username === "nehal" && password === "123" && role === "user") ||
    (username === "test" && password === "123" && role === "agent")
  ) {
    const user = {
      username,
      age: 22,
      role,
    };

    jwt.sign({ user }, SECRETKEY, (err, token) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.json({
          token,
          user,
        });
      }
    });
  } else {
    res.sendStatus(403);
  }
});

server.listen(config.PORT, () => {
  socket(server);
  console.log("Server is listening at :", config.PORT);
});
